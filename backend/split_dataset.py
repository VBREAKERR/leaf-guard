import os
import shutil
import random

print("🚀 Script Started")

source_dir = r"C:\Users\acer\Desktop\LEAF GUARD\raw_dataset"
train_dir = "../dataset/train"
val_dir = "../dataset/validation"

split_ratio = 0.8

os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)

for class_name in os.listdir(source_dir):
    print("Processing:", class_name)

    class_path = os.path.join(source_dir, class_name)

    if not os.path.isdir(class_path):
        continue

    images = [img for img in os.listdir(class_path)
              if img.lower().endswith(('.jpg', '.png', '.jpeg'))]

    random.shuffle(images)

    split_index = int(len(images) * split_ratio)

    train_images = images[:split_index]
    val_images = images[split_index:]

    os.makedirs(os.path.join(train_dir, class_name), exist_ok=True)
    os.makedirs(os.path.join(val_dir, class_name), exist_ok=True)

    for img in train_images:
        shutil.copy(
            os.path.join(class_path, img),
            os.path.join(train_dir, class_name, img)
        )

    for img in val_images:
        shutil.copy(
            os.path.join(class_path, img),
            os.path.join(val_dir, class_name, img)
        )

print("✅ Dataset split completed successfully!")