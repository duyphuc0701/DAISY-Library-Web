import pandas as pd
import json
import os

def excel_to_json(excel_file_path, json_file_path="Books.json", sheet_name=0, column_mapping=None):
    if not os.path.exists(excel_file_path):
        print(f"Lỗi: File Excel không tồn tại tại đường dẫn '{excel_file_path}'.")
        return False

    try:
        df = pd.read_excel(excel_file_path, sheet_name=sheet_name)
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file Excel tại đường dẫn '{excel_file_path}'.")
        return False
    except ValueError as e:
        print(f"Lỗi khi đọc sheet '{sheet_name}' từ file Excel: {e}. Vui lòng kiểm tra tên sheet.")
        return False
    except Exception as e:
        print(f"Lỗi không xác định khi đọc file Excel: {e}")
        return False

    default_column_mapping = {
        'id': 'id',
        'title': 'title',
        'author': 'author',
        'coverURL': 'coverURL',
        'shortDesc': 'shortDesc',
        'publisher': 'publisher',
        'year': 'year',
        'category': 'category',
        'google_drive_URL': 'downloadURL' 
    }

    if column_mapping is None:
        column_mapping = default_column_mapping

    missing_columns = [col_excel for col_excel in column_mapping if col_excel not in df.columns]
    if missing_columns:
        print(f"Lỗi: Các cột sau không tìm thấy trong file Excel: {', '.join(missing_columns)}.")
        return False

    # Đổi tên các cột theo mapping
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

    books_data = df_final.to_dict(orient="records")

    try:
        with open(json_file_path, "w", encoding="utf-8") as f:
            json.dump(books_data, f, ensure_ascii=False, indent=4)
        print(f"✅ Dữ liệu từ '{excel_file_path}' đã được chuyển sang JSON '{json_file_path}'.")
        return True
    except IOError as e:
        print(f"Lỗi ghi file JSON '{json_file_path}': {e}")
        return False
    except Exception as e:
        print(f"Lỗi không xác định khi ghi file JSON: {e}")
        return False

if __name__ == "__main__":
    excel_input_file = "DaisyBooks.xlsx"
    json_output_file = "Books.json"

    column_map = {
        'id': 'id',
        'title': 'title',
        'author': 'author',
        'coverURL': 'coverURL',
        'shortDesc': 'shortDesc',
        'publisher': 'publisher',
        'year': 'year',
        'category': 'category',
        'google_drive_URL': 'downloadURL'
    }

    success = excel_to_json(excel_input_file, json_output_file, column_mapping=column_map)

    if success:
        print("\n🎉 Quá trình chuyển đổi hoàn tất.")
    else:
        print("\n❌ Quá trình chuyển đổi gặp lỗi.")
