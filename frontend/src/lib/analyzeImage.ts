/**
 * Placeholder function for plant disease detection.
 * Replace this with your own trained model API call.
 *
 * @param imageUrl - The URL of the uploaded plant image
 * @returns Mock detection results
 */
export async function analyzeImage(_imageUrl: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock results — replace with your model's API response
  const diseases = [
    {
      disease_name: "Tomato Late Blight",
      confidence: 94.5,
      description:
        "Late blight is a potentially devastating disease of tomato and potato, caused by the oomycete Phytophthora infestans. It spreads rapidly in warm and wet conditions.",
      treatment:
        "Apply copper-based fungicide immediately. Remove and destroy affected leaves. Ensure proper air circulation between plants.",
      prevention:
        "Use resistant varieties. Avoid overhead watering. Rotate crops annually. Apply preventive fungicide during wet seasons.",
    },
    {
      disease_name: "Powdery Mildew",
      confidence: 87.2,
      description:
        "A common fungal disease that appears as white powdery spots on leaves. It thrives in warm, dry climates with high humidity at night.",
      treatment:
        "Spray with neem oil or potassium bicarbonate solution. Remove severely affected leaves.",
      prevention:
        "Ensure good air circulation. Water at the base of the plant. Choose mildew-resistant varieties.",
    },
    {
      disease_name: "Healthy",
      confidence: 98.1,
      description: "No disease detected. Your plant appears to be in good health!",
      treatment: "No treatment needed. Continue regular care.",
      prevention: "Maintain proper watering, sunlight, and nutrient schedules.",
    },
  ];

  return diseases[Math.floor(Math.random() * diseases.length)];
}
