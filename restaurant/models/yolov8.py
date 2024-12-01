import cv2
from ultralytics import YOLO
import time
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import threading
import cv2
from ultralytics import YOLO
import time

model = YOLO("yolov8n.pt")
def process_video(video_path, output_video_path, hospital_email, db, Video):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open video {video_path}")
        return

    # Fetch existing videos for the hospital
    existing_videos = Video.query.filter_by(hospital_email=hospital_email).all()
    if not existing_videos:
        print(f"Error: No initial video data found for {hospital_email}")
        return
    total_seats = existing_videos[-1].total_seats if existing_videos else "Unknown"

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame, conf=0.5)
        person_count = sum(1 for r in results for box in r.boxes.data if int(box[-1]) == 0)

        # Save real-time results to the database
        new_video = Video(
            hospital_email=hospital_email,
            video_path=video_path,
            total_seats=total_seats,
            person_count=person_count,
            time=time.time(),
        )
        db.session.add(new_video)
        db.session.commit()

    cap.release()
