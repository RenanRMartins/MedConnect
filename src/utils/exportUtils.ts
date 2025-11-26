import { ExportOptions } from '@/types';

// Exportar para CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar vírgulas e aspas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar para Excel (usando formato CSV que Excel pode abrir)
export const exportToExcel = (data: any[], filename: string) => {
  exportToCSV(data, filename);
};

// Exportar para PDF (usando window.print ou biblioteca externa)
export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Criar uma nova janela para impressão
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

// Função genérica de exportação
export const exportData = async (data: any[], options: ExportOptions) => {
  switch (options.format) {
    case 'csv':
    case 'excel':
      exportToCSV(data, `relatorio_${options.reportType}_${new Date().toISOString().split('T')[0]}`);
      break;
    case 'pdf':
      // Para PDF, precisaríamos de uma biblioteca como jsPDF
      // Por enquanto, usamos print
      const tableId = 'export-table';
      const existingTable = document.getElementById(tableId);
      if (existingTable) {
        existingTable.remove();
      }
      
      const table = document.createElement('table');
      table.id = tableId;
      table.style.display = 'none';
      
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        data.forEach(row => {
          const tr = document.createElement('tr');
          headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] ?? '';
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
      }
      
      document.body.appendChild(table);
      exportToPDF(tableId, `relatorio_${options.reportType}`);
      setTimeout(() => {
        const tableToRemove = document.getElementById(tableId);
        if (tableToRemove) {
          tableToRemove.remove();
        }
      }, 1000);
      break;
    default:
      console.error('Formato de exportação não suportado');
  }
};

