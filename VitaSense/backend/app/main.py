from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import json

from app.analysis.csv_parser import process_file_list
from app.analysis.preprocessing import preprocess_sample_data
from app.analysis.feature_extraction import extract_features
from app.analysis.pca_analysis import perform_pca
from app.analysis.insights import generate_insights

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global store for demonstration purposes
current_analysis_results = {
    "status": "No data loaded",
    "dataset": None,
    "features": None,
    "pca": None,
    "insights": None,
    "validation": None
}

def analyze_files(files_data):
    valid_files, invalid_files = process_file_list(files_data)
    
    analyzed_samples = []
    features_list = []
    
    for f in valid_files:
        f = preprocess_sample_data(f)
        f = extract_features(f)
        analyzed_samples.append({
            "sample_id": f["sample_id"],
            "label": f["label"],
            "baseline_mq3": f["baseline_mq3"],
            "baseline_mq135": f["baseline_mq135"],
            "data": f["processed_data"].to_dict(orient="records")
        })
        features_list.append(f["features"])
        
    validation = {
        "files_received": len(files_data),
        "valid_files": len(valid_files),
        "invalid_files": len(invalid_files),
        "errors": invalid_files
    }
    
    pca_data, pca_error = None, None
    if len(features_list) > 1:
        pca_data, pca_error = perform_pca(features_list)
        
    insights = generate_insights(features_list, pca_data)
    
    global current_analysis_results
    current_analysis_results = {
        "status": "success",
        "dataset": analyzed_samples,
        "features": features_list,
        "pca": pca_data,
        "pca_error": pca_error,
        "insights": insights,
        "validation": validation
    }
    
    return current_analysis_results

@app.get("/api/load-default")
async def load_default_dataset():
    data_dir = "d:/VitaSense/data_phase2"
    if not os.path.exists(data_dir):
        return {"error": "Default data directory not found"}
        
    files_data = []
    for fname in os.listdir(data_dir):
        if fname.upper().endswith(".CSV"):
            fpath = os.path.join(data_dir, fname)
            content = None
            for enc in ("utf-16", "utf-8-sig", "utf-8", "latin-1"):
                try:
                    with open(fpath, "r", encoding=enc) as f:
                        content = f.read()
                    break
                except (UnicodeDecodeError, UnicodeError):
                    continue
            if content is not None:
                files_data.append({"filename": fname, "content": content})
                
    results = analyze_files(files_data)
    return {"message": f"Loaded {len(files_data)} files successfully.", "validation": results["validation"]}

@app.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    if not files:
        return {"error": "No files provided"}
        
    files_data = []
    for f in files:
        content = (await f.read()).decode('utf-8', errors='ignore')
        files_data.append({"filename": f.filename, "content": content})
        
    results = analyze_files(files_data)
    return {"message": "Files uploaded and analyzed successfully", "validation": results["validation"]}

@app.get("/api/analysis-results")
async def get_results():
    if current_analysis_results["status"] == "No data loaded":
        return current_analysis_results
    return current_analysis_results
