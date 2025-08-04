import { Initiative, ValidationResult, ValidationError } from '@/types';

const REQUIRED_COLUMNS = [
  'Initiative Name',
  'Owner',
  'Strategic Area',
  'Status',
  'Start Date',
  'Committed Date',
  'Completion Date',
  'Days in \'In Progress\'',
  'Completion %',
  'Blocker Description',
  'Last Updated',
  'Notes / Comments'
];

const VALID_STATUSES = ['Completed', 'In Progress', 'Blocked', 'Planned', ''];

export class ValidationService {
  static validateCSVStructure(data: any[]): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (!data || data.length === 0) {
      errors.push({
        row: 0,
        column: 'file',
        message: 'CSV file is empty or could not be parsed'
      });
      return { isValid: false, errors };
    }

    // Check if first row has all required columns
    const headers = Object.keys(data[0]);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      errors.push({
        row: 0,
        column: 'headers',
        message: `Missing required columns: ${missingColumns.join(', ')}`
      });
    }

    // Validate data rows
    data.forEach((row, index) => {
      if (this.isEmptyRow(row)) return; // Skip empty rows

      // Validate status values
      const status = row['Status'];
      if (status && !VALID_STATUSES.includes(status)) {
        errors.push({
          row: index + 1,
          column: 'Status',
          message: `Invalid status "${status}". Must be one of: ${VALID_STATUSES.filter(s => s).join(', ')}`
        });
      }

      // Validate date formats if present
      this.validateDateFormat(row['Start Date'], 'Start Date', index + 1, errors);
      this.validateDateFormat(row['Committed Date'], 'Committed Date', index + 1, errors);
      this.validateDateFormat(row['Completion Date'], 'Completion Date', index + 1, errors);

      // Validate numeric fields
      this.validateNumericField(row['Days in \'In Progress\''], 'Days in \'In Progress\'', index + 1, errors);
      this.validatePercentageField(row['Completion %'], 'Completion %', index + 1, errors);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isEmptyRow(row: any): boolean {
    return Object.values(row).every(value => !value || String(value).trim() === '');
  }

  private static validateDateFormat(dateStr: string, fieldName: string, rowIndex: number, errors: ValidationError[]) {
    if (!dateStr || dateStr.trim() === '') return;

    // Accept various date formats: MM/DD/YYYY, M/D/YYYY, DD-MMM, etc.
    const dateFormats = [
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY or M/D/YYYY
      /^\d{1,2}-[A-Za-z]{3}$/, // DD-MMM (e.g., 28-May)
      /^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/, // DD-MMM-YY or DD-MMM-YYYY
      /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
    ];

    const isValidFormat = dateFormats.some(format => format.test(dateStr.trim()));
    
    if (!isValidFormat) {
      errors.push({
        row: rowIndex,
        column: fieldName,
        message: `Invalid date format "${dateStr}". Expected formats: MM/DD/YYYY, DD-MMM, or YYYY-MM-DD`
      });
    }
  }

  private static validateNumericField(value: string, fieldName: string, rowIndex: number, errors: ValidationError[]) {
    if (!value || value.trim() === '') return;

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      errors.push({
        row: rowIndex,
        column: fieldName,
        message: `Invalid numeric value "${value}". Must be a positive number`
      });
    }
  }

  private static validatePercentageField(value: string, fieldName: string, rowIndex: number, errors: ValidationError[]) {
    if (!value || value.trim() === '') return;

    const cleanValue = value.replace('%', '');
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      errors.push({
        row: rowIndex,
        column: fieldName,
        message: `Invalid percentage value "${value}". Must be between 0 and 100`
      });
    }
  }
}
