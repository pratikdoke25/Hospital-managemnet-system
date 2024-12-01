from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import threading
from models.yolov8 import process_video

app = Flask(__name__)
app.secret_key = "supersecretkey"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospitals.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

UPLOAD_FOLDER = 'videos/input/'
OUTPUT_FOLDER = 'videos/output/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hospital_email = db.Column(db.String(150), db.ForeignKey('hospital.email'), nullable=False)
    video_path = db.Column(db.String(200), nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    person_count = db.Column(db.Integer, nullable=True)
    time = db.Column(db.Float, nullable=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/restaurant')
def restaurant():
    return redirect(url_for('dashboard'))

@app.route('/hospital')
def hospital():
    return redirect(url_for('http://localhost:5173/user'))  

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        hospital_name = request.form['hospital_name']
        email = request.form['email']
        password = request.form['password']
        
        # Check if the email already exists
        existing_hospital = Hospital.query.filter_by(email=email).first()
        if existing_hospital:
            return "This email is already registered. Please use a different email."
        
        # Add new hospital if email is unique
        new_hospital = Hospital(name=hospital_name, email=email, password=password)
        db.session.add(new_hospital)
        db.session.commit()
        return redirect(url_for('login'))
    
    return render_template('hospital_register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        hospital = Hospital.query.filter_by(email=email, password=password).first()
        if hospital:
            session['hospital'] = email
            return redirect(url_for('upload_video'))
        return "Invalid credentials"
    return render_template('hospital_login.html')

@app.route('/upload_video', methods=['GET', 'POST'])
def upload_video():
    if 'hospital' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        video = request.files['video']
        total_seats = request.form['total_seats']
        video_path = os.path.join(UPLOAD_FOLDER, video.filename)
        video.save(video_path)

        # Save video details to database
        new_video = Video(hospital_email=session['hospital'], video_path=video_path, total_seats=total_seats)
        db.session.add(new_video)
        db.session.commit()

        # Get hospital_email from session
        hospital_email = session['hospital']

        # Process video asynchronously
        output_video_path = os.path.join(OUTPUT_FOLDER, f"processed_{video.filename}")
        
        def thread_target(hospital_email):
            with app.app_context():  # Push application context
                process_video(video_path, output_video_path, hospital_email, db, Video)

        threading.Thread(target=thread_target, args=(hospital_email,)).start()

        return "Video processing started..."
    return render_template('process_video.html')


@app.route('/dashboard')
def dashboard():
    # Query all hospitals
    hospitals = Hospital.query.all()
    
    # Convert the list of hospital objects to a dictionary with email as the key
    hospitals_dict = {hospital.email: {'name': hospital.name, 'password': hospital.password} for hospital in hospitals}

    return render_template('dashboard.html', hospitals=hospitals_dict)

@app.route('/live_results/<hospital_email>')
def live_results(hospital_email):
    return render_template('user_dashboard.html', hospital_email=hospital_email)

@app.route('/fetch_live_results/<hospital_email>')
def fetch_live_results(hospital_email):
    videos = Video.query.filter_by(hospital_email=hospital_email).all()
    results = [
        {
            "time": video.time,
            "person_count": video.person_count,
            "total_seats": video.total_seats
        } for video in videos
    ]
    return jsonify(results)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they do not exist
    app.run(debug=True)

