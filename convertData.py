import pandas as pd
import json
import requests
from io import BytesIO
import re

def convert_google_sheet_url_to_export_excel(url):
    """
    Nhận URL gốc của Google Sheet và chuyển sang URL export dạng Excel (.xlsx)
    """
    match = re.search(r'/d/([a-zA-Z0-9-_]+)', url)
    if not match:
        raise ValueError("Không thể trích xuất ID từ URL Google Sheet.")
    sheet_id = match.group(1)
    export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=xlsx&id={sheet_id}"
    return export_url

def excel_url_to_json(google_sheet_edit_url, json_file_path="books.json", sheet_name=0, column_mapping=None):
    try:
        # Tự động chuyển URL Google Sheet gốc sang URL export Excel
        export_url = convert_google_sheet_url_to_export_excel(google_sheet_edit_url)

        # Tải nội dung file Excel từ URL
        response = requests.get(export_url)
        response.raise_for_status()

        # Đọc sheet từ nội dung Excel (có thể là chỉ số hoặc tên sheet)
        df = pd.read_excel(BytesIO(response.content), sheet_name=sheet_name)
    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi tải file từ URL: {e}")
        return False
    except ValueError as e:
        print(f"Lỗi khi đọc sheet '{sheet_name}': {e}")
        return False
    except Exception as e:
        print(f"Lỗi không xác định khi xử lý Google Sheet: {e}")
        return False

    # Mapping mặc định nếu không cung cấp
    default_column_mapping = {
        'id': 'id',
        'title': 'title',
        'author': 'author',
        'image': 'image',
        'description': 'description',
        'publisher': 'publisher',
        'year': 'year',
        'category': 'category',
        'downloadURL': 'downloadURL'
    }

    if column_mapping is None:
        column_mapping = default_column_mapping

    # Kiểm tra các cột có đầy đủ không
    missing_columns = [col_excel for col_excel in column_mapping if col_excel not in df.columns]
    if missing_columns:
        print(f"Lỗi: Các cột sau không tìm thấy trong Google Sheet: {', '.join(missing_columns)}.")
        return False

    # Đổi tên cột theo mapping
    df_mapped = df.rename(columns=column_mapping)
    json_fields = list(column_mapping.values())
    df_final = df_mapped[json_fields].copy()

    # Xử lý cột 'year'
    if 'year' in df_final.columns:
        def process_year(year_value):
            if pd.isna(year_value):
                return None
            year_str = str(year_value)
            if year_str.isdigit():
                return str(int(year_value))
            else:
                return year_str
        df_final['year'] = df_final['year'].apply(process_year)
        print("Đã xử lý cột 'year': chuyển thành chuỗi hoặc None.")

    # ✅ Xử lý chuyển link Google Drive thành link download trực tiếp
    def convert_drive_link(link):
        if pd.isna(link):
            return None
        match = re.search(r'd/([a-zA-Z0-9_-]+)', link)
        if match:
            file_id = match.group(1)
            print(f"Chuyển đổi link Google Drive thành link download: {link} -> https://drive.google.com/uc?export=download&id={file_id}")
            return f"https://drive.google.com/uc?export=download&id={file_id}"
        else:
            print(f"Không khớp định dạng link Google Drive: {link}")
        return link  # Trả lại link cũ nếu không khớp

    df_final['downloadURL'] = df_final['downloadURL'].apply(convert_drive_link)

    # Ghi file JSON
    try:
        with open(json_file_path, "w", encoding="utf-8") as f:
            json.dump(df_final.to_dict(orient="records"), f, ensure_ascii=False, indent=4)
        print(f"✅ Dữ liệu từ Google Sheet đã được chuyển sang JSON '{json_file_path}'.")
        return True
    except IOError as e:
        print(f"Lỗi ghi file JSON: {e}")
        return False

if __name__ == "__main__":
    # URL gốc Google Sheet (dạng "edit")
    google_sheet_url = "https://docs.google.com/spreadsheets/d/1Rsdn321YuGaqp-mVt0YrCeMU73d-WzyZ4qtWm21LfD8/edit?gid=0#gid=0"

    # Tùy chọn: sheet đầu tiên (mặc định là 0) hoặc tên sheet như "Books"
    sheet_name = 0  # hoặc "Sheet1"

    success = excel_url_to_json(
        google_sheet_edit_url=google_sheet_url,
        json_file_path="books.json",
        sheet_name=sheet_name
    )

    if success:
        print("\nQuá trình chuyển đổi hoàn tất.")
    else:
        print("\nQuá trình chuyển đổi gặp lỗi.")
