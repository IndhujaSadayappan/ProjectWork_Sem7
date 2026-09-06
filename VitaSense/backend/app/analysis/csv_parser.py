import pandas as pd
import io

def parse_csv_content(content: str, filename: str):
    """
    Parses the raw CSV content to find the data table and metadata.
    Handles two formats:
      - Format A: has a 'Time_sec,Sample,Label,...' header row
      - Format B: no header row; data rows start directly after preamble
    Returns (is_valid, validation_msg, sample_id, label, base_mq3, base_mq135, df)
    """
    import re

    lines = content.split('\n')
    # Strip BOM from every line (common in UTF-16 decoded files)
    lines = [l.lstrip('\ufeff').rstrip('\r') for l in lines]

    REQUIRED_COLS = ['Time_sec', 'Sample', 'Label', 'Baseline_MQ3', 'Baseline_MQ135', 'MQ3', 'MQ135']
    NUMERIC_COLS  = ['Time_sec', 'Baseline_MQ3', 'Baseline_MQ135', 'MQ3', 'MQ135']

    # ── Format A: look for the explicit header row ──────────────────────────
    data_start_idx = -1
    for i, line in enumerate(lines):
        stripped = line.strip().lstrip('\ufeff')
        if stripped.startswith('Time_sec') and 'MQ3' in stripped and 'MQ135' in stripped:
            data_start_idx = i
            break

    if data_start_idx != -1:
        # Header found — parse normally
        data_str = '\n'.join(lines[data_start_idx:])
        try:
            df = pd.read_csv(io.StringIO(data_str))
        except Exception as e:
            return False, f"Failed to parse CSV data in {filename}: {e}", None, None, None, None, None

        df.columns = [c.strip().lstrip('\ufeff') for c in df.columns]
    else:
        # ── Format B: no header row ─────────────────────────────────────────
        # Find first row that looks like pure numeric CSV data:
        # e.g.  "30,D03,Diseased,397,142,431,139"
        data_row_re = re.compile(
            r'^\s*\d+\s*,\s*\S+\s*,\s*\S+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*$'
        )
        first_data_idx = -1
        for i, line in enumerate(lines):
            if data_row_re.match(line):
                first_data_idx = i
                break

        if first_data_idx == -1:
            return False, f"Missing required columns header in {filename}", None, None, None, None, None

        # Collect all consecutive data rows (stop at blank / non-matching lines)
        data_lines = []
        for line in lines[first_data_idx:]:
            # Stop at blank lines or lines that clearly aren't data rows (text)
            stripped = line.strip()
            if stripped == '' or stripped.startswith('=') or not stripped[0].isdigit():
                break
            data_lines.append(stripped)

        if not data_lines:
            return False, f"No data rows found in {filename}", None, None, None, None, None

        data_str = 'Time_sec,Sample,Label,Baseline_MQ3,Baseline_MQ135,MQ3,MQ135\n' + '\n'.join(data_lines)
        try:
            df = pd.read_csv(io.StringIO(data_str))
        except Exception as e:
            return False, f"Failed to parse headerless CSV data in {filename}: {e}", None, None, None, None, None

    # ── Common validation ───────────────────────────────────────────────────
    df.columns = [c.strip().lstrip('\ufeff') for c in df.columns]

    for c in REQUIRED_COLS:
        if c not in df.columns:
            return False, f"Missing column '{c}' in {filename} (found: {list(df.columns)})", None, None, None, None, None

    for c in NUMERIC_COLS:
        df[c] = pd.to_numeric(df[c], errors='coerce')

    df = df.dropna(subset=NUMERIC_COLS).reset_index(drop=True)

    if len(df) == 0:
        return False, f"No valid data rows found in {filename}", None, None, None, None, None

    try:
        sample_id  = str(df.iloc[0]['Sample'])
        label      = str(df.iloc[0]['Label']).strip()
        base_mq3   = float(df.iloc[0]['Baseline_MQ3'])
        base_mq135 = float(df.iloc[0]['Baseline_MQ135'])
    except Exception:
        return False, f"Invalid metadata format in {filename}", None, None, None, None, None

    if base_mq3 == 0 or base_mq135 == 0:
        return False, f"Zero baseline for sensors in {filename}", None, None, None, None, None

    return True, "Valid", sample_id, label, base_mq3, base_mq135, df

def process_file_list(files_data):
    """
    files_data is a list of dicts: {'filename': str, 'content': str}
    """
    valid_files = []
    invalid_files = []
    sample_ids = set()
    
    for f_data in files_data:
        filename = f_data['filename']
        content = f_data['content']
        is_valid, msg, s_id, label, b_mq3, b_mq135, df = parse_csv_content(content, filename)
        
        if not is_valid:
            invalid_files.append({'filename': filename, 'reason': msg})
            continue
            
        if s_id in sample_ids:
            invalid_files.append({'filename': filename, 'reason': f"Duplicate Sample ID {s_id}"})
            continue
            
        sample_ids.add(s_id)
        
        # Keep clean df and rename Time_sec just as Time for easier use if needed
        # df = df[['Time_sec', 'MQ3', 'MQ135']]
        
        valid_files.append({
            'filename': filename,
            'sample_id': s_id,
            'label': label,
            'baseline_mq3': b_mq3,
            'baseline_mq135': b_mq135,
            'data': df
        })
        
    return valid_files, invalid_files
