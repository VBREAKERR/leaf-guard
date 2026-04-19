import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# ======================
# APP
# ======================
app = Flask(__name__)
CORS(app)

# ======================
# DEVICE
# ======================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# ======================
# LOAD CLASSES
# ======================
classes = sorted(os.listdir("../dataset/train"))

# ======================
# 🔥 MODEL (RESNET18)
# ======================
model = models.resnet18(pretrained=False)

num_features = model.fc.in_features
model.fc = nn.Linear(num_features, len(classes))

# ======================
# LOAD MODEL WEIGHTS
# ======================
model.load_state_dict(torch.load("leaf_model.pth", map_location=device))
model.to(device)
model.eval()

# ======================
# TRANSFORM
# ======================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ======================
# ROUTES
# ======================
@app.route("/")
def home():
    return "Server is running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["file"]
    filepath = "temp.jpg"
    file.save(filepath)

    image = Image.open(filepath).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)

        # ✅ SOFTMAX FOR CONFIDENCE
        probs = F.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)

    result = classes[predicted.item()]
    conf = round(confidence.item() * 100, 2)

    return jsonify({
        "prediction": result,
        "confidence": conf
    })

# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)