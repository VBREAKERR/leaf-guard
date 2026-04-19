import os
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import json

# ======================
# DEVICE
# ======================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ======================
# LOAD CLASS NAMES
# ======================
train_data_path = "../dataset/train"
classes = sorted([d for d in os.listdir(train_data_path)])

# ======================
# MODEL (same as training)
# ======================
class CNN(nn.Module):
    def __init__(self, num_classes):
        super(CNN, self).__init__()

        self.conv = nn.Sequential(
            nn.Conv2d(3, 32, 3),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, 3),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )

        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 26 * 26, 128),
            nn.ReLU(),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        return self.fc(self.conv(x))

# ======================
# LOAD MODEL
# ======================
model = CNN(len(classes))
model.load_state_dict(torch.load("leaf_model.pth", map_location=device))
model.to(device)
model.eval()

# ======================
# IMAGE TRANSFORM
# ======================
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# ======================
# PREDICT FUNCTION
# ======================
def predict_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)

    return classes[predicted.item()]

# ======================
# TEST
# ======================
if __name__ == "__main__":
    img_path = "test.jpg"  # put any test image
    result = predict_image(img_path)
    print("Prediction:", result)