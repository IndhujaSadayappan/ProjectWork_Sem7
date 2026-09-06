import numpy as np
from scipy.integrate import trapezoid

def extract_sensor_features(df, sensor, baseline, time_col='Time_sec'):
    """
    Extracts numerical features for a single sensor.
    """
    times = df[time_col].values
    values = df[sensor].values
    delta = df[f'Delta_{sensor}'].values
    pct = df[f'Pct_{sensor}'].values
    
    if len(values) == 0:
        return {}
        
    v_max = np.max(values)
    v_min = np.min(values)
    v_mean = np.mean(values)
    v_std = np.std(values, ddof=1) if len(values) > 1 else 0
    v_final = values[-1]
    
    max_delta = np.max(np.abs(delta))
    max_pct = np.max(pct)
    
    idx_max = np.argmax(values)
    time_to_max = times[idx_max]
    
    auc = trapezoid(values, times) if len(times) > 1 else 0
    
    # Overall slope
    if len(times) > 1:
        overall_slope = np.polyfit(times, values, 1)[0]
    else:
        overall_slope = 0
        
    # Initial slope (first 20%)
    n20 = max(2, int(len(times) * 0.2))
    if len(times) >= n20:
        initial_slope = np.polyfit(times[:n20], values[:n20], 1)[0]
    else:
        initial_slope = overall_slope
        
    # Steady state mean (last 20%)
    if len(times) >= n20:
        steady_state_mean = np.mean(values[-n20:])
    else:
        steady_state_mean = v_final
        
    return {
        f'{sensor}_Baseline': baseline,
        f'{sensor}_Max': float(v_max),
        f'{sensor}_Min': float(v_min),
        f'{sensor}_Mean': float(v_mean),
        f'{sensor}_Std': float(v_std),
        f'{sensor}_Final': float(v_final),
        f'{sensor}_DeltaMax': float(max_delta),
        f'{sensor}_PercentageResponse': float(max_pct),
        f'{sensor}_InitialSlope': float(initial_slope),
        f'{sensor}_OverallSlope': float(overall_slope),
        f'{sensor}_TimeToMax': float(time_to_max),
        f'{sensor}_AUC': float(auc),
        f'{sensor}_SteadyStateMean': float(steady_state_mean)
    }

def extract_features(sample_dict):
    df = sample_dict['processed_data']
    
    features = {
        'Sample_ID': sample_dict['sample_id'],
        'Label': sample_dict['label']
    }
    
    mq3_features = extract_sensor_features(df, 'MQ3', sample_dict['baseline_mq3'])
    mq135_features = extract_sensor_features(df, 'MQ135', sample_dict['baseline_mq135'])
    
    features.update(mq3_features)
    features.update(mq135_features)
    
    sample_dict['features'] = features
    return sample_dict
