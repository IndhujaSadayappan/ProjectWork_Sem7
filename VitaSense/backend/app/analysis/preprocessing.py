import pandas as pd
import numpy as np

def preprocess_sample_data(sample_dict):
    """
    Takes a verified sample dictionary and adds delta and percentage response DataFrames.
    """
    df = sample_dict['data'].copy()
    b_mq3 = sample_dict['baseline_mq3']
    b_mq135 = sample_dict['baseline_mq135']
    
    # Delta
    df['Delta_MQ3'] = df['MQ3'] - b_mq3
    df['Delta_MQ135'] = df['MQ135'] - b_mq135
    
    # Percentage (avoid div by zero, already verified baseline != 0)
    df['Pct_MQ3'] = (df['Delta_MQ3'] / b_mq3) * 100
    df['Pct_MQ135'] = (df['Delta_MQ135'] / b_mq135) * 100
    
    sample_dict['processed_data'] = df
    return sample_dict
