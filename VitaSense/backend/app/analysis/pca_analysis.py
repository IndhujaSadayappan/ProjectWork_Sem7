import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def perform_pca(features_list):
    """
    Takes a list of feature dictionaries.
    Returns PCA dict output and observation dictionary for insights.
    """
    if len(features_list) < 2:
        return None, "Not enough samples for PCA."
        
    df = pd.DataFrame(features_list)
    
    # Exclude non-numerical or non-sensor columns
    meta_cols = ['Sample_ID', 'Label']
    feature_cols = [c for c in df.columns if c not in meta_cols]
    
    X = df[feature_cols].copy()
    
    # Handle missing values by replacing with mean (shouldn't have any in clean data)
    X = X.fillna(X.mean())
    
    scaler = StandardScaler()
    try:
        X_scaled = scaler.fit_transform(X)
    except Exception as e:
         return None, f"StandardScaling failed: {str(e)}"
         
    pca = PCA(n_components=2)
    try:
        principal_components = pca.fit_transform(X_scaled)
    except Exception as e:
         return None, f"PCA failed: {str(e)}"
         
    df_pca = pd.DataFrame(data=principal_components, columns=['PC1', 'PC2'])
    df_pca['Sample_ID'] = df['Sample_ID']
    df_pca['Label'] = df['Label']
    
    variance_ratio = pca.explained_variance_ratio_
    
    pca_data = {
        'points': df_pca.to_dict('records'),
        'variance': {
            'pc1': float(variance_ratio[0] * 100),
            'pc2': float(variance_ratio[1] * 100),
            'cumulative': float((variance_ratio[0] + variance_ratio[1]) * 100)
        }
    }
    
    return pca_data, None
