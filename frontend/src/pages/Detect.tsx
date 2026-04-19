import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Detect = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const diseaseDB: any = {
    "Apple - Apple scab": {
      description: "Fungal disease causing olive-green lesions on leaves and fruit.",
      treatment: "Apply fungicides like captan or sulfur.",
      prevention: "Prune trees and avoid wet foliage."
    },
    "Apple - Black rot": {
      description: "Dark circular lesions leading to fruit rot.",
      treatment: "Remove infected parts and apply fungicide.",
      prevention: "Maintain sanitation and airflow."
    },
    "Apple - Cedar apple rust": {
      description: "Bright orange spots on leaves.",
      treatment: "Use fungicides like myclobutanil.",
      prevention: "Avoid nearby cedar trees."
    },
    "Apple - Healthy": {
      description: "Plant is healthy.",
      treatment: "No treatment needed.",
      prevention: "Maintain proper care."
    },

    "Tomato - Bacterial spot": {
      description: "Dark spots on leaves and fruit.",
      treatment: "Use copper sprays.",
      prevention: "Avoid overhead watering."
    },
    "Tomato - Early blight": {
      description: "Brown spots with ring patterns.",
      treatment: "Apply fungicide.",
      prevention: "Rotate crops."
    },
    "Tomato - Late blight": {
      description: "Severe decay of leaves and fruit.",
      treatment: "Use fungicides immediately.",
      prevention: "Avoid wet conditions."
    },
    "Tomato - Leaf Mold": {
      description: "Yellow patches and mold growth.",
      treatment: "Apply fungicide.",
      prevention: "Improve airflow."
    },
    "Tomato - Septoria leaf spot": {
      description: "Small circular leaf spots.",
      treatment: "Use fungicide sprays.",
      prevention: "Remove infected leaves."
    },
    "Tomato - Spider mites Two spotted spider mite": {
      description: "Tiny pests causing yellow speckling.",
      treatment: "Use insecticidal soap.",
      prevention: "Maintain humidity."
    },
    "Tomato - Target Spot": {
      description: "Brown lesions with rings.",
      treatment: "Apply fungicide.",
      prevention: "Avoid leaf wetness."
    },
    "Tomato - Mosaic virus": {
      description: "Leaves become mottled and distorted.",
      treatment: "Remove infected plants.",
      prevention: "Control insects."
    },
    "Tomato - Yellow Leaf Curl Virus": {
      description: "Leaves curl and plants weaken.",
      treatment: "Remove infected plants.",
      prevention: "Control whiteflies."
    },
    "Tomato - Healthy": {
      description: "Plant is healthy.",
      treatment: "No treatment needed.",
      prevention: "Maintain care."
    },

    "Potato - Early blight": {
      description: "Brown ringed spots.",
      treatment: "Apply fungicide.",
      prevention: "Crop rotation."
    },
    "Potato - Late blight": {
      description: "Rapid decay disease.",
      treatment: "Use fungicides.",
      prevention: "Avoid moisture."
    },
    "Potato - Healthy": {
      description: "Healthy plant.",
      treatment: "No treatment needed.",
      prevention: "Maintain hygiene."
    },

    "Pepper bell - Bacterial spot": {
      description: "Water-soaked leaf spots.",
      treatment: "Apply copper bactericides.",
      prevention: "Avoid wet leaves."
    },
    "Pepper bell - Healthy": {
      description: "Plant is healthy.",
      treatment: "No treatment needed.",
      prevention: "Regular monitoring."
    },

    "Grape - Black rot": {
      description: "Fruit rot and leaf spots.",
      treatment: "Apply fungicide.",
      prevention: "Remove infected fruit."
    },
    "Grape - Esca (Black Measles)": {
      description: "Leaf discoloration disease.",
      treatment: "Prune infected vines.",
      prevention: "Maintain vineyard hygiene."
    },
    "Grape - Leaf blight": {
      description: "Leaf browning.",
      treatment: "Use fungicide.",
      prevention: "Avoid moisture."
    },
    "Grape - Healthy": {
      description: "Healthy plant.",
      treatment: "No treatment needed.",
      prevention: "Maintain care."
    },

    "Strawberry - Leaf scorch": {
      description: "Leaves dry and brown.",
      treatment: "Remove infected leaves.",
      prevention: "Improve watering."
    },
    "Strawberry - Healthy": {
      description: "Healthy plant.",
      treatment: "No treatment needed.",
      prevention: "Maintain care."
    },

    "Peach - Bacterial spot": {
      description: "Dark lesions on leaves.",
      treatment: "Apply bactericides.",
      prevention: "Avoid wet conditions."
    },
    "Peach - Healthy": {
      description: "Healthy plant.",
      treatment: "No treatment needed.",
      prevention: "Maintain hygiene."
    }
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const cleanName = data.prediction
        .replace(/___/g, " - ")
        .replace(/_/g, " ");

      const info = diseaseDB[cleanName] || {
        description: "This disease affects plant health.",
        treatment: "Use appropriate treatment.",
        prevention: "Maintain hygiene."
      };

      const diagnosis = {
        disease_name: cleanName,
        confidence: data.confidence,
        ...info
      };

      setResult(diagnosis);

      await supabase.from("scans").insert({
        user_id: user?.id,
        image_url: preview,
        disease_name: cleanName,
        confidence: data.confidence,
        description: info.description,
        treatment: info.treatment,
        prevention: info.prevention,
        status: "completed",
      });

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">

        <h1 className="text-3xl font-bold text-green-700">
          🌿 Plant Disease Detection
        </h1>

        {!result && (
          <Card>
            <CardContent className="p-6">
              {!preview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className="border-2 border-dashed p-10 text-center cursor-pointer rounded-xl hover:border-green-500"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="mx-auto mb-3 text-green-600" />
                  <p className="font-medium">Upload or Drag Image</p>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <img src={preview} className="mx-auto max-h-80 rounded-xl shadow" />
                  <Button onClick={handleAnalyze} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="shadow-xl rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-xl text-green-700">
                🌿 {result.disease_name}
              </CardTitle>
              <p>
                Confidence: <b className="text-green-600">{result.confidence}%</b>
              </p>
            </CardHeader>

            <CardContent className="space-y-4">

              {preview && (
                <img src={preview} className="mx-auto max-h-60 rounded-xl shadow-md" />
              )}

              <div className="bg-green-50 p-4 rounded-xl">
                <b>🧠 Description</b>
                <p>{result.description}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <b>💊 Treatment</b>
                <p>{result.treatment}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl">
                <b>🛡 Prevention</b>
                <p>{result.prevention}</p>
              </div>

              <Button onClick={reset} className="w-full bg-green-600">
                Scan Another 🌱
              </Button>

            </CardContent>
          </Card>
        )}

      </div>
    </AppLayout>
  );
};

export default Detect;