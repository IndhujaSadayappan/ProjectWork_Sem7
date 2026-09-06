import pandas as pd
import numpy as np

def generate_insights(features_list, pca_data):
    if not features_list or len(features_list) == 0:
        return {"report": "No data available."}
        
    df = pd.DataFrame(features_list)
    labels = df['Label'].unique()
    
    total = len(df)
    counts = df['Label'].value_counts().to_dict()
    
    report = []
    report.append(f"The current dataset contains {total} samples, including " + 
                  " and ".join([f"{v} {k}" for k, v in counts.items()]) + " samples.")
                  
    # Group comparisons
    if len(labels) == 2:
        l1, l2 = labels[0], labels[1]
        
        # Determine informative features using Cohen's d style metric
        feature_cols = [c for c in df.columns if c not in ['Sample_ID', 'Label']]
        
        largest_diff = 0
        best_feature = "None"
        info_mq3 = ""
        info_mq135 = ""
        
        for c in feature_cols:
            mean1 = df[df['Label'] == l1][c].mean()
            mean2 = df[df['Label'] == l2][c].mean()
            std1 = df[df['Label'] == l1][c].std(ddof=1)
            std2 = df[df['Label'] == l2][c].std(ddof=1)
            
            pool_std = np.sqrt((std1**2 + std2**2) / 2)
            if pool_std > 0:
                d = abs(mean1 - mean2) / pool_std
                if d > largest_diff:
                    largest_diff = d
                    best_feature = c
                    
        # Just simple descriptive for MQ3
        mean_affected_mq3 = df[df['Label'].str.contains('iseased', case=False)]['MQ3_PercentageResponse'].mean() if len(df[df['Label'].str.contains('iseased', case=False)]) > 0 else df['MQ3_PercentageResponse'].mean()
        mean_unaf_mq3 = df[~df['Label'].str.contains('iseased', case=False)]['MQ3_PercentageResponse'].mean() if len(df[~df['Label'].str.contains('iseased', case=False)]) > 0 else 0
        
        if mean_affected_mq3 > mean_unaf_mq3:
            report.append(f"MQ-3 shows higher average percentage response for affected samples compared to unaffected.")
        else:
            report.append(f"MQ-3 does not show significantly higher average percentage response for affected samples.")
            
        mean_affected_mq135 = df[df['Label'].str.contains('iseased', case=False)]['MQ135_PercentageResponse'].mean() if len(df[df['Label'].str.contains('iseased', case=False)]) > 0 else df['MQ135_PercentageResponse'].mean()
        mean_unaf_mq135 = df[~df['Label'].str.contains('iseased', case=False)]['MQ135_PercentageResponse'].mean() if len(df[~df['Label'].str.contains('iseased', case=False)]) > 0 else 0
        
        if mean_affected_mq135 > mean_unaf_mq135:
            report.append(f"MQ-135 shows higher average percentage response for affected samples.")
        else:
            report.append(f"MQ-135 does not show significantly higher average percentage response for affected samples.")
            
        report.append(f"Feature analysis indicates that {best_feature} shows the largest observed difference between the two groups.")
        
    if pca_data:
        pc1 = pca_data['variance']['pc1']
        pc2 = pca_data['variance']['pc2']
        report.append(f"PC1 explains {pc1:.2f}% of the variance and PC2 explains {pc2:.2f}%.")
        
        # Analyze overlap - very basic heuristic looking at distance of centroids vs cluster spread
        pca_df = pd.DataFrame(pca_data['points'])
        if len(labels) == 2:
            pca1 = pca_df[pca_df['Label'] == labels[0]]
            pca2 = pca_df[pca_df['Label'] == labels[1]]
            
            c1 = np.array([pca1['PC1'].mean(), pca1['PC2'].mean()])
            c2 = np.array([pca2['PC1'].mean(), pca2['PC2'].mean()])
            dist = np.linalg.norm(c1 - c2)
            
            s1 = np.sqrt(pca1['PC1'].var() + pca1['PC2'].var())
            s2 = np.sqrt(pca2['PC1'].var() + pca2['PC2'].var())
            avg_spread = (s1 + s2) / 2
            
            if dist > 2 * avg_spread:
                sep_status = "clear separation"
            elif dist > avg_spread:
                sep_status = "partial separation"
            else:
                sep_status = "significant overlap"
                
            report.append(f"The PCA projection shows {sep_status} between the groups.")
            report.append(f"The current results suggest potential for distinguishing manually screened affected and unaffected mango leaves using the current two-sensor VOC setup, based on the current experimental evidence. Longitudinal validation is required for pre-symptomatic detection claims.")
            
    return {"insights": "\n\n".join(report)}
