import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  invoiceInfo: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 3
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 120,
    fontWeight: 'bold'
  },
  value: {
    flex: 1
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  tableCol1: {
    flex: 2
  },
  tableCol2: {
    flex: 1,
    textAlign: 'right'
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 5,
    marginTop: 5,
    fontWeight: 'bold'
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#555'
  }
});

// PDF Document Template
const InvoiceDocument = ({ tour, client }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency based on tour type
  const formatCurrency = (amount, currencyType) => {
    if (currencyType === 'PKR') {
      return `PKR ${amount.toFixed(2)}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  // Determine which currency to use
  const currency = tour.currency || (tour.type === 'local' ? 'PKR' : 'USD');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Travel Agency Invoice</Text>
        </View>
        
        <View style={styles.invoiceInfo}>
          <Text>Invoice #: {tour.id}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{client.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{client.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{client.email}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tour Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tour Type:</Text>
            <Text style={styles.value}>{tour.type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(tour.date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>People:</Text>
            <Text style={styles.value}>{tour.peopleCount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Currency:</Text>
            <Text style={styles.value}>{currency}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Summary</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>{tour.type} Tour for {tour.peopleCount} people</Text>
            <Text style={styles.tableCol2}>{formatCurrency(tour.price, currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.tableCol1}>Total</Text>
            <Text style={styles.tableCol2}>{formatCurrency(tour.price, currency)}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Download Component
const PDFGenerator = ({ tour, client }) => {
  return (
    <PDFDownloadLink 
      document={<InvoiceDocument tour={tour} client={client} />} 
      fileName={`invoice-${tour.id}.pdf`}
      className="pdf-download-link"
    >
      {({ blob, url, loading, error }) => 
        loading ? 'Generating PDF...' : 'Download Invoice PDF'
      }
    </PDFDownloadLink>
  );
};

export default PDFGenerator; 