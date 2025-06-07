# Email Layout

The `EmailLayout` component provides a layout optimized for creating email templates with consistent styling and structure. It's designed to work across various email clients with appropriate fallbacks and compatibility features.

## Features

- **Email Client Compatibility**: Table-based layouts and inline styles for maximum compatibility
- **Responsive Design**: Adapts to different screen sizes and email clients
- **Theming Options**: Light, dark, and custom color schemes
- **Header and Footer Support**: Optional sections for branding and contact information
- **Preheader Text**: Hidden text that appears in email client previews
- **Reset Styles**: Baseline CSS resets for consistent rendering
- **Component System**: Includes EmailSection and EmailButton components for common email elements
- **Outlook VML Support**: Special handling for Microsoft Outlook rendering
- **Preview Mode**: Visual representation of how the email will appear

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { EmailLayout, EmailSection, EmailButton } from '@pulseui/layout';

function BasicEmailTemplate() {
  return (
    <EmailLayout 
      width="600px"
      showHeader
      headerContent={
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <img 
            src="https://via.placeholder.com/150x50?text=Logo" 
            alt="Company Logo" 
            width="150" 
            height="50"
          />
        </div>
      }
      showFooter
      footerContent={
        <div style={{ textAlign: 'center', fontSize: '12px' }}>
          <p>© 2025 Company Name. All rights reserved.</p>
          <p>123 Street Name, City, Country</p>
          <p>
            <a href="#" style={{ color: '#666', marginRight: '10px' }}>Unsubscribe</a>
            <a href="#" style={{ color: '#666' }}>View in browser</a>
          </p>
        </div>
      }
      showPreheader
      preheaderText="Special offer inside - 20% off your next purchase!"
      showPreview
    >
      <EmailSection padding="30px 20px">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: '0 0 20px 0' }}>Welcome to Our Newsletter</h1>
          <p style={{ margin: '0 0 20px 0' }}>
            Thank you for subscribing to our newsletter. We're excited to share our latest updates with you.
          </p>
          
          <EmailButton 
            href="https://example.com" 
            backgroundColor="#1976d2"
            textColor="#ffffff"
          >
            Get Started
          </EmailButton>
        </div>
      </EmailSection>
      
      <EmailSection 
        backgroundColor="#f5f5f5"
        padding="30px 20px"
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0' }}>Featured Products</h2>
          
          <table width="100%" cellPadding="0" cellSpacing="0" border="0">
            <tr>
              <td valign="top" style={{ padding: '0 10px' }}>
                <img 
                  src="https://via.placeholder.com/150?text=Product1" 
                  alt="Product 1" 
                  width="150" 
                  height="150"
                  style={{ marginBottom: '10px' }}
                />
                <h3 style={{ fontSize: '16px', margin: '0 0 5px 0' }}>Product 1</h3>
                <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>$99.99</p>
                <EmailButton 
                  href="https://example.com/product1" 
                  backgroundColor="#1976d2"
                  textColor="#ffffff"
                  padding="8px 16px"
                  width="120px"
                >
                  View Details
                </EmailButton>
              </td>
              <td valign="top" style={{ padding: '0 10px' }}>
                <img 
                  src="https://via.placeholder.com/150?text=Product2" 
                  alt="Product 2" 
                  width="150" 
                  height="150"
                  style={{ marginBottom: '10px' }}
                />
                <h3 style={{ fontSize: '16px', margin: '0 0 5px 0' }}>Product 2</h3>
                <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>$149.99</p>
                <EmailButton 
                  href="https://example.com/product2" 
                  backgroundColor="#1976d2"
                  textColor="#ffffff"
                  padding="8px 16px"
                  width="120px"
                >
                  View Details
                </EmailButton>
              </td>
            </tr>
          </table>
        </div>
      </EmailSection>
    </EmailLayout>
  );
}
```

## Examples

### Promotional Email

```tsx
import { EmailLayout, EmailSection, EmailButton } from '@pulseui/layout';

function PromotionalEmail() {
  return (
    <EmailLayout 
      width="600px"
      showHeader
      headerContent={
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <img 
            src="https://via.placeholder.com/180x60?text=BrandLogo" 
            alt="Brand Logo" 
            width="180" 
            height="60"
          />
        </div>
      }
      showFooter
      footerContent={
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
          <p>© 2025 Brand Name. All rights reserved.</p>
          <p>
            <a href="#" style={{ color: '#666', marginRight: '10px' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#666', marginRight: '10px' }}>Terms of Service</a>
            <a href="#" style={{ color: '#666' }}>Unsubscribe</a>
          </p>
          <p>123 Street Name, City, Country</p>
        </div>
      }
      showPreheader
      preheaderText="Limited time offer: 30% off all products for our summer sale!"
      theme="custom"
      customTheme={{
        backgroundColor: '#ffffff',
        textColor: '#333333',
        primaryColor: '#ff6b6b',
        secondaryColor: '#f9f9f9'
      }}
      showPreview
    >
      <EmailSection 
        backgroundColor="#ff6b6b" 
        textColor="#ffffff"
        padding="40px 20px"
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '0 0 20px 0',
            color: '#ffffff'
          }}>
            SUMMER SALE
          </h1>
          <p style={{ 
            fontSize: '20px', 
            margin: '0 0 30px 0',
            color: '#ffffff'
          }}>
            Enjoy 30% off all products!
          </p>
          <EmailButton 
            href="https://example.com/sale" 
            backgroundColor="#ffffff"
            textColor="#ff6b6b"
            width="180px"
            borderRadius="30px"
            padding="15px 30px"
          >
            SHOP NOW
          </EmailButton>
        </div>
      </EmailSection>
      
      <EmailSection padding="40px 20px">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 30px 0' }}>Top Deals</h2>
          
          <table width="100%" cellPadding="0" cellSpacing="0" border="0">
            <tr>
              <td valign="top" style={{ padding: '0 10px 30px 10px' }}>
                <img 
                  src="https://via.placeholder.com/250x250?text=Product1" 
                  alt="Product 1" 
                  width="250" 
                  height="250"
                  style={{ marginBottom: '15px' }}
                />
                <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>Summer T-Shirt</h3>
                <p style={{ 
                  margin: '0 0 5px 0',
                  fontSize: '16px'
                }}>
                  <span style={{ 
                    textDecoration: 'line-through', 
                    color: '#999',
                    marginRight: '10px'
                  }}>
                    $49.99
                  </span>
                  <span style={{ 
                    color: '#ff6b6b',
                    fontWeight: 'bold'
                  }}>
                    $34.99
                  </span>
                </p>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                  Limited stock available
                </p>
                <EmailButton 
                  href="https://example.com/product1" 
                  backgroundColor="#ff6b6b"
                  textColor="#ffffff"
                  padding="10px 20px"
                  width="150px"
                >
                  Buy Now
                </EmailButton>
              </td>
              <td valign="top" style={{ padding: '0 10px 30px 10px' }}>
                <img 
                  src="https://via.placeholder.com/250x250?text=Product2" 
                  alt="Product 2" 
                  width="250" 
                  height="250"
                  style={{ marginBottom: '15px' }}
                />
                <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>Beach Shorts</h3>
                <p style={{ 
                  margin: '0 0 5px 0',
                  fontSize: '16px'
                }}>
                  <span style={{ 
                    textDecoration: 'line-through', 
                    color: '#999',
                    marginRight: '10px'
                  }}>
                    $39.99
                  </span>
                  <span style={{ 
                    color: '#ff6b6b',
                    fontWeight: 'bold'
                  }}>
                    $27.99
                  </span>
                </p>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                  Best seller
                </p>
                <EmailButton 
                  href="https://example.com/product2" 
                  backgroundColor="#ff6b6b"
                  textColor="#ffffff"
                  padding="10px 20px"
                  width="150px"
                >
                  Buy Now
                </EmailButton>
              </td>
            </tr>
          </table>
        </div>
      </EmailSection>
      
      <EmailSection 
        backgroundColor="#f9f9f9"
        padding="30px 20px"
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0' }}>Limited Time Offer</h2>
          <p style={{ margin: '0 0 20px 0' }}>
            Use the code <strong>SUMMER30</strong> at checkout to get 30% off your entire purchase.
            Offer valid until August 31, 2025.
          </p>
          <EmailButton 
            href="https://example.com/sale" 
            backgroundColor="#ff6b6b"
            textColor="#ffffff"
            width="200px"
          >
            Shop All Deals
          </EmailButton>
        </div>
      </EmailSection>
    </EmailLayout>
  );
}
```

### Newsletter Email

```tsx
import { EmailLayout, EmailSection, EmailButton } from '@pulseui/layout';

function NewsletterEmail() {
  return (
    <EmailLayout 
      width="650px"
      showHeader
      headerContent={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '15px 20px'
        }}>
          <img 
            src="https://via.placeholder.com/120x40?text=NewsLogo" 
            alt="Newsletter Logo" 
            width="120" 
            height="40"
          />
          <div style={{ fontSize: '14px', color: '#ffffff' }}>
            June 2025 Edition
          </div>
        </div>
      }
      showFooter
      footerContent={
        <div style={{ padding: '0 20px' }}>
          <table width="100%" cellPadding="0" cellSpacing="0" border="0">
            <tr>
              <td style={{ padding: '20px 0', borderTop: '1px solid #dddddd' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style={{ verticalAlign: 'top', width: '70%' }}>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 10px 0' }}>
                        © 2025 News Organization. All rights reserved.
                      </p>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                        Our address: 123 News Street, Media City, Country
                      </p>
                    </td>
                    <td style={{ verticalAlign: 'top', width: '30%', textAlign: 'right' }}>
                      <div>
                        <a href="#" style={{ display: 'inline-block', margin: '0 5px' }}>
                          <img 
                            src="https://via.placeholder.com/30x30?text=FB" 
                            alt="Facebook" 
                            width="30" 
                            height="30"
                          />
                        </a>
                        <a href="#" style={{ display: 'inline-block', margin: '0 5px' }}>
                          <img 
                            src="https://via.placeholder.com/30x30?text=TW" 
                            alt="Twitter" 
                            width="30" 
                            height="30"
                          />
                        </a>
                        <a href="#" style={{ display: 'inline-block', margin: '0 5px' }}>
                          <img 
                            src="https://via.placeholder.com/30x30?text=IG" 
                            alt="Instagram" 
                            width="30" 
                            height="30"
                          />
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', padding: '0 0 20px 0', fontSize: '12px', color: '#666' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                  You're receiving this email because you signed up for our newsletter.
                </p>
                <p style={{ margin: '0' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'underline', marginRight: '10px' }}>Unsubscribe</a>
                  <a href="#" style={{ color: '#666', textDecoration: 'underline', marginRight: '10px' }}>Update Preferences</a>
                  <a href="#" style={{ color: '#666', textDecoration: 'underline' }}>View in Browser</a>
                </p>
              </td>
            </tr>
          </table>
        </div>
      }
      showPreheader
      preheaderText="This month's top stories: Tech innovations, market trends, and exclusive interviews"
      theme="custom"
      customTheme={{
        backgroundColor: '#ffffff',
        textColor: '#333333',
        primaryColor: '#2c3e50',
        secondaryColor: '#f8f9fa'
      }}
      showPreview
    >
      <EmailSection 
        backgroundColor="#2c3e50" 
        textColor="#ffffff"
        padding="40px 20px"
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0 0 15px 0',
            color: '#ffffff'
          }}>
            Monthly Newsletter
          </h1>
          <p style={{ 
            fontSize: '16px', 
            margin: '0',
            color: '#ecf0f1'
          }}>
            The latest news, trends, and insights
          </p>
        </div>
      </EmailSection>
      
      <EmailSection padding="30px 20px">
        <table width="100%" cellPadding="0" cellSpacing="0" border="0">
          <tr>
            <td style={{ paddingBottom: '30px' }}>
              <h2 style={{ fontSize: '22px', margin: '0 0 15px 0', color: '#2c3e50' }}>
                This Month's Highlights
              </h2>
              
              <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                <tr>
                  <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
                    <img 
                      src="https://via.placeholder.com/200x150?text=Article1" 
                      alt="Article 1" 
                      width="200" 
                      height="150"
                      style={{ marginBottom: '10px' }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'top' }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#2c3e50' }}>
                      The Future of AI in Business
                    </h3>
                    <p style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#555' }}>
                      Artificial intelligence is transforming how businesses operate. 
                      Our exclusive report explores the latest trends and what they mean for your industry.
                    </p>
                    <EmailButton 
                      href="https://example.com/article1" 
                      backgroundColor="#2c3e50"
                      textColor="#ffffff"
                      padding="8px 15px"
                      width="120px"
                    >
                      Read More
                    </EmailButton>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style={{ paddingBottom: '30px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                <tr>
                  <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
                    <img 
                      src="https://via.placeholder.com/200x150?text=Article2" 
                      alt="Article 2" 
                      width="200" 
                      height="150"
                      style={{ marginBottom: '10px' }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'top' }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#2c3e50' }}>
                      Market Trends for Q3 2025
                    </h3>
                    <p style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#555' }}>
                      Our analysts break down the most important market trends to watch 
                      in the coming quarter and provide actionable insights.
                    </p>
                    <EmailButton 
                      href="https://example.com/article2" 
                      backgroundColor="#2c3e50"
                      textColor="#ffffff"
                      padding="8px 15px"
                      width="120px"
                    >
                      Read More
                    </EmailButton>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </EmailSection>
      
      <EmailSection 
        backgroundColor="#f8f9fa"
        padding="30px 20px"
      >
        <div>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#2c3e50', textAlign: 'center' }}>
            Upcoming Events
          </h2>
          
          <table width="100%" cellPadding="0" cellSpacing="0" border="0">
            <tr>
              <td style={{ padding: '15px', backgroundColor: '#ffffff', marginBottom: '15px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style={{ verticalAlign: 'top', width: '80px', paddingRight: '15px' }}>
                      <div style={{ 
                        backgroundColor: '#2c3e50', 
                        color: '#ffffff', 
                        textAlign: 'center', 
                        padding: '10px', 
                        borderRadius: '5px' 
                      }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>15</div>
                        <div style={{ fontSize: '14px' }}>JUL</div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', color: '#2c3e50' }}>
                        Industry Conference 2025
                      </h3>
                      <p style={{ fontSize: '14px', margin: '0 0 5px 0', color: '#555' }}>
                        Virtual Event | 9:00 AM - 5:00 PM EST
                      </p>
                      <EmailButton 
                        href="https://example.com/event1" 
                        backgroundColor="#2c3e50"
                        textColor="#ffffff"
                        padding="5px 10px"
                        width="100px"
                      >
                        Register
                      </EmailButton>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '15px', backgroundColor: '#ffffff', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '15px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style={{ verticalAlign: 'top', width: '80px', paddingRight: '15px' }}>
                      <div style={{ 
                        backgroundColor: '#2c3e50', 
                        color: '#ffffff', 
                        textAlign: 'center', 
                        padding: '10px', 
                        borderRadius: '5px' 
                      }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>22</div>
                        <div style={{ fontSize: '14px' }}>JUL</div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', color: '#2c3e50' }}>
                        Webinar: Future Trends
                      </h3>
                      <p style={{ fontSize: '14px', margin: '0 0 5px 0', color: '#555' }}>
                        Online | 2:00 PM - 3:30 PM EST
                      </p>
                      <EmailButton 
                        href="https://example.com/event2" 
                        backgroundColor="#2c3e50"
                        textColor="#ffffff"
                        padding="5px 10px"
                        width="100px"
                      >
                        Register
                      </EmailButton>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </EmailSection>
    </EmailLayout>
  );
}
```

## API Reference

### EmailLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the email layout |
| `width` | `number \| string` | `'600px'` | The width of the email content |
| `maxWidth` | `number \| string` | `'100%'` | The maximum width of the email content |
| `alignment` | `'left' \| 'center' \| 'right'` | `'center'` | The alignment of the email content |
| `theme` | `'light' \| 'dark' \| 'custom'` | `'light'` | The theme of the email |
| `customTheme` | `{ backgroundColor?: string; textColor?: string; primaryColor?: string; secondaryColor?: string; }` | - | Custom theme colors when theme is set to 'custom' |
| `showHeader` | `boolean` | `false` | Whether to include a header |
| `headerContent` | `React.ReactNode` | - | Content for the header |
| `showFooter` | `boolean` | `false` | Whether to include a footer |
| `footerContent` | `React.ReactNode` | - | Content for the footer |
| `showPreheader` | `boolean` | `false` | Whether to include a preheader text |
| `preheaderText` | `string` | `''` | The preheader text |
| `useInlineStyles` | `boolean` | `true` | Whether to use inline styles |
| `useTableLayout` | `boolean` | `true` | Whether to use table-based layout |
| `includeResetStyles` | `boolean` | `true` | Whether to include basic email reset styles |
| `showPreview` | `boolean` | `false` | Whether to show a preview of the email |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

### EmailSection Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the email section |
| `backgroundColor` | `string` | - | The background color of the section |
| `textColor` | `string` | - | The text color of the section |
| `padding` | `string \| number` | `'20px'` | The padding of the section |
| `useTableLayout` | `boolean` | `true` | Whether to use table-based layout |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

### EmailButton Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | - | The URL to link to |
| `children` | `React.ReactNode` | - | The button text |
| `backgroundColor` | `string` | `'#1976d2'` | The background color of the button |
| `textColor` | `string` | `'#ffffff'` | The text color of the button |
| `width` | `string \| number` | - | The width of the button |
| `alignment` | `'left' \| 'center' \| 'right'` | `'center'` | The alignment of the button |
| `padding` | `string` | `'12px 24px'` | The padding of the button |
| `borderRadius` | `string \| number` | `'4px'` | The border radius of the button |
| `useVML` | `boolean` | `true` | Whether to use VML for Outlook compatibility |
| `className` | `string` | `''` | Custom class name |

## Implementation Details

The EmailLayout component works by:

1. Using table-based layouts for maximum compatibility with email clients
2. Applying inline styles to ensure consistent rendering
3. Including email-specific reset styles to normalize behavior
4. Supporting VML for Microsoft Outlook compatibility
5. Providing a hidden preheader text for email client previews
6. Using a responsive design that adapts to different screen sizes

## Email Client Compatibility

The EmailLayout component is designed to work with a wide range of email clients:

- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS)
- Outlook (Windows, macOS, Web, iOS, Android)
- Yahoo Mail
- Thunderbird
- Samsung Email
- AOL Mail

## Best Practices

When using the EmailLayout component, follow these best practices:

1. Keep the email width between 600-650px for optimal display
2. Use table-based layouts for complex structures
3. Include a preheader text for better open rates
4. Test your email in multiple clients before sending
5. Use simple, web-safe fonts
6. Keep file sizes small for faster loading
7. Include both text and image content for better deliverability

## License

MIT
