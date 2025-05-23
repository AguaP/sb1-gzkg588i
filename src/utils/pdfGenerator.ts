import { Student } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Helper to get student status text
const getStatusText = (status: string): string => {
  switch (status) {
    case 'boarded': return 'Sí';
    case 'no-show': return 'No';
    case 'pending': return 'Pendiente';
    default: return 'Pendiente';
  }
};

export const generatePDF = (
  students: Student[],
  routeName: string,
  routeSubtitle: string
): void => {
  const doc = new jsPDF();
  
  // Current date formatted
  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Add title
  doc.setFontSize(20);
  doc.text(`Lista de Estudiantes - Ruta ${routeName}`, 14, 20);
  
  // Add subtitle and date
  doc.setFontSize(12);
  doc.text(routeSubtitle, 14, 30);
  doc.text(`Generado el: ${date}`, 14, 40);

  // Create table
  const tableData = students.map(student => [
    student.ticketNumber.toString(),
    `${student.name} ${student.lastName}`,
    student.code,
    student.phone,
    student.faculty,
    getStatusText(student.status)
  ]);

  // Add table
  (doc as any).autoTable({
    startY: 50,
    head: [['#', 'Nombre y Apellido', 'Código', 'Celular', 'Facultad', 'Subió']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 84, 166], // UNI Blue
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Add total at the bottom
  const finalY = (doc as any).lastAutoTable.finalY || 50;
  doc.text(`Total de estudiantes: ${students.length}`, 14, finalY + 10);

  // Save the PDF
  doc.save(`lista_${routeName.toLowerCase()}_${Date.now()}.pdf`);
};