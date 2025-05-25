# Print Layout

The `PrintLayout` component provides a layout optimized for printing documents. It offers control over paper size, orientation, margins, headers, footers, and page numbers to create professional printable content.

## Features

- **Paper Size Options**: Support for A4, A5, Letter, Legal, and Tabloid
- **Orientation Control**: Portrait or landscape printing
- **Margin Management**: Predefined or custom margin settings
- **Headers and Footers**: Optional areas for consistent document information
- **Page Numbers**: Customizable position and starting number
- **Print Button**: Optional button to trigger printing
- **Preview Mode**: Visual representation of how content will print
- **Print Stylesheet**: Automatic application of print-specific styles
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { PrintLayout } from '@strive-ui/layout';

function BasicPrintDocument() {
  return (
    <PrintLayout 
      paperSize="a4"
      orientation="portrait"
      margin="medium"
      showPrintButton
      showPreview
    >
      <h1>Sample Document</h1>
      <p>This is a sample document formatted for printing.</p>
      <p>The content will be properly formatted for A4 paper in portrait orientation.</p>
      
      <h2>Section 1</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
      nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl 
      nisl eget nisl.</p>
      
      <h2>Section 2</h2>
      <p>Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, 
      eget ultricies nisl nisl eget nisl.</p>
    </PrintLayout>
  );
}
```

## Examples

### Invoice with Header and Footer

```tsx
import { PrintLayout } from '@strive-ui/layout';

function InvoiceDocument() {
  const currentDate = new Date().toLocaleDateString();
  
  const headerContent = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <div>
        <h2 style={{ margin: 0 }}>Company Name</h2>
        <p style={{ margin: '5px 0 0 0' }}>123 Business Street, City, Country</p>
      </div>
      <div>
        <img 
          src="https://via.placeholder.com/150x50?text=Logo" 
          alt="Company Logo" 
          style={{ height: '50px' }}
        />
      </div>
    </div>
  );
  
  const footerContent = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      fontSize: '12px',
      color: '#666'
    }}>
      <div>Company Name Inc. | Tax ID: 123456789</div>
      <div>Contact: info@company.com | +1 234 567 890</div>
    </div>
  );
  
  return (
    <PrintLayout 
      paperSize="a4"
      margin="medium"
      showHeader
      headerContent={headerContent}
      showFooter
      footerContent={footerContent}
      showPageNumbers
      pageNumberPosition="bottom-right"
      showPrintButton
      showPreview
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ marginTop: 0 }}>INVOICE</h1>
            <p>Invoice #: INV-2023-001</p>
            <p>Date: {currentDate}</p>
          </div>
          <div>
            <h3>Bill To:</h3>
            <p>Client Name</p>
            <p>Client Address</p>
            <p>City, Country</p>
            <p>client@email.com</p>
          </div>
        </div>
        
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginBottom: '30px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Item</th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Quantity</th>
              <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Service A</td>
              <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>1</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$500.00</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$500.00</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Product B</td>
              <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>2</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$100.00</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$200.00</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Maintenance C</td>
              <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>5</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$50.00</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$250.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd' }}></td>
              <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right', border: '1px solid #ddd' }}>Subtotal</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$950.00</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd' }}></td>
              <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right', border: '1px solid #ddd' }}>Tax (10%)</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>$95.00</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd' }}></td>
              <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right', border: '1px solid #ddd' }}>Total</td>
              <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right', border: '1px solid #ddd' }}>$1,045.00</td>
            </tr>
          </tfoot>
        </table>
        
        <div>
          <h3>Payment Terms</h3>
          <p>Payment due within 30 days. Please make checks payable to Company Name Inc.</p>
          <p>Bank details: Bank Name, Account #: 123456789, Routing #: 987654321</p>
          
          <div style={{ marginTop: '50px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </PrintLayout>
  );
}
```

### Resume with Custom Margins

```tsx
import { PrintLayout } from '@strive-ui/layout';

function ResumeDocument() {
  return (
    <PrintLayout 
      paperSize="letter"
      margin="custom"
      customMargins={{ top: 20, right: 25, bottom: 20, left: 25 }}
      showPrintButton
      printButtonPosition="floating"
      showPreview
    >
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '5px', fontSize: '28px' }}>John Doe</h1>
          <p style={{ margin: '0', color: '#666' }}>
            123 Main Street, City, State | (123) 456-7890 | john.doe@email.com
          </p>
        </header>
        
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ 
            borderBottom: '2px solid #1976d2', 
            paddingBottom: '5px', 
            marginBottom: '15px',
            color: '#1976d2'
          }}>
            Professional Summary
          </h2>
          <p>
            Experienced software developer with over 5 years of experience in web development,
            specializing in React and TypeScript. Proven track record of delivering high-quality,
            scalable applications for enterprise clients.
          </p>
        </section>
        
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ 
            borderBottom: '2px solid #1976d2', 
            paddingBottom: '5px', 
            marginBottom: '15px',
            color: '#1976d2'
          }}>
            Experience
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <h3 style={{ margin: 0 }}>Senior Frontend Developer</h3>
              <span>2020 - Present</span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>Tech Company Inc., City, State</p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Developed and maintained multiple React applications using TypeScript</li>
              <li>Implemented responsive designs and improved application performance</li>
              <li>Collaborated with UX designers to create intuitive user interfaces</li>
              <li>Mentored junior developers and conducted code reviews</li>
            </ul>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <h3 style={{ margin: 0 }}>Frontend Developer</h3>
              <span>2018 - 2020</span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>Web Solutions LLC, City, State</p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Built and maintained client websites using React and JavaScript</li>
              <li>Implemented responsive designs and ensured cross-browser compatibility</li>
              <li>Worked with backend developers to integrate APIs</li>
              <li>Participated in Agile development processes</li>
            </ul>
          </div>
        </section>
        
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ 
            borderBottom: '2px solid #1976d2', 
            paddingBottom: '5px', 
            marginBottom: '15px',
            color: '#1976d2'
          }}>
            Education
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <h3 style={{ margin: 0 }}>Bachelor of Science in Computer Science</h3>
            <span>2014 - 2018</span>
          </div>
          <p style={{ margin: 0, fontStyle: 'italic' }}>University Name, City, State</p>
        </section>
        
        <section>
          <h2 style={{ 
            borderBottom: '2px solid #1976d2', 
            paddingBottom: '5px', 
            marginBottom: '15px',
            color: '#1976d2'
          }}>
            Skills
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'GraphQL', 'Node.js', 'Git', 'Agile', 'Jest', 'Webpack'].map((skill) => (
              <span key={skill} style={{ 
                backgroundColor: '#e3f2fd', 
                padding: '5px 10px', 
                borderRadius: '4px',
                color: '#1976d2',
                fontSize: '14px'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </PrintLayout>
  );
}
```

## API Reference

### PrintLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the print layout |
| `paperSize` | `'a4' \| 'a5' \| 'letter' \| 'legal' \| 'tabloid'` | `'a4'` | The paper size for printing |
| `orientation` | `'portrait' \| 'landscape'` | `'portrait'` | The orientation of the paper |
| `margin` | `'none' \| 'small' \| 'medium' \| 'large' \| 'custom'` | `'medium'` | The margin size |
| `customMargins` | `{ top?: number; right?: number; bottom?: number; left?: number; }` | `{ top: 15, right: 15, bottom: 15, left: 15 }` | Custom margin values (in mm) when margin is set to 'custom' |
| `showPageNumbers` | `boolean` | `false` | Whether to show page numbers |
| `startPageNumber` | `number` | `1` | The starting page number |
| `pageNumberPosition` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-center'` | The position of the page numbers |
| `showHeader` | `boolean` | `false` | Whether to include a header |
| `headerContent` | `React.ReactNode` | - | Content for the header |
| `showFooter` | `boolean` | `false` | Whether to include a footer |
| `footerContent` | `React.ReactNode` | - | Content for the footer |
| `showPrintButton` | `boolean` | `false` | Whether to show a print button |
| `printButtonPosition` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'floating'` | `'top-right'` | The position of the print button |
| `printButtonText` | `string` | `'Print'` | Custom text for the print button |
| `hideNoPrint` | `boolean` | `true` | Whether to hide elements with the class 'no-print' when printing |
| `addPrintStyles` | `boolean` | `true` | Whether to add a print stylesheet automatically |
| `showPreview` | `boolean` | `false` | Whether to show a preview of how the content will look when printed |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the PrintLayout component accepts all standard HTML div attributes.

## Implementation Details

The PrintLayout component works by:

1. Creating a container with dimensions based on the selected paper size
2. Adding appropriate margins and spacing for headers, footers, and content
3. Injecting a print stylesheet with media queries for print-specific styling
4. Providing a print button to trigger the browser's print functionality
5. Optionally showing a preview of how the content will look when printed

## Browser Support

The PrintLayout component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
