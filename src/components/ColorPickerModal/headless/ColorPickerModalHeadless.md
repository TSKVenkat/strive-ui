# ColorPickerModalHeadless

A headless component for creating customizable color picker modals with extensive flexibility for developers. The color picker modal allows users to select colors in various formats (HEX, RGB, RGBA, HSL, HSLA) with a variety of input methods.

## Usage

```jsx
import { ColorPickerModalHeadless } from 'strive-ui';

function MyColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#3498db');

  return (
    <ColorPickerModalHeadless.Root
      defaultColor={selectedColor}
      onChange={(colorValue) => console.log('Color changed:', colorValue)}
      onSelect={(colorValue) => {
        console.log('Color selected:', colorValue);
        setSelectedColor(colorValue.hex);
      }}
      format="hex"
      showOpacity={true}
      showPresets={true}
      closeOnSelect={true}
    >
      <ColorPickerModalHeadless.Trigger
        style={{
          backgroundColor: selectedColor,
          width: '40px',
          height: '40px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      />
      
      <ColorPickerModalHeadless.Portal>
        <ColorPickerModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        
        <ColorPickerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '320px',
            zIndex: 1001
          }}
        >
          <ColorPickerModalHeadless.Content>
            <ColorPickerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>Select Color</h3>
              <ColorPickerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </ColorPickerModalHeadless.Close>
            </ColorPickerModalHeadless.Header>
            
            <ColorPickerModalHeadless.Body
              style={{
                padding: '16px'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <ColorPickerModalHeadless.Preview
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <ColorPickerModalHeadless.HexInput
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <ColorPickerModalHeadless.FormatSelector
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <ColorPickerModalHeadless.ColorValue
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Hue</label>
                <ColorPickerModalHeadless.HueSlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px',
                    appearance: 'none',
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Saturation</label>
                <ColorPickerModalHeadless.SaturationSlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Lightness</label>
                <ColorPickerModalHeadless.LightnessSlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Opacity</label>
                <ColorPickerModalHeadless.OpacitySlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Presets</label>
                <ColorPickerModalHeadless.Presets
                  label=""
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                />
              </div>
            </ColorPickerModalHeadless.Body>
            
            <ColorPickerModalHeadless.Footer
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <ColorPickerModalHeadless.Close
                as="button"
                style={{
                  padding: '8px 16px',
                  background: '#f1f1f1',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </ColorPickerModalHeadless.Close>
              <ColorPickerModalHeadless.Select
                style={{
                  padding: '8px 16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Select
              </ColorPickerModalHeadless.Select>
            </ColorPickerModalHeadless.Footer>
          </ColorPickerModalHeadless.Content>
        </ColorPickerModalHeadless.Container>
      </ColorPickerModalHeadless.Portal>
    </ColorPickerModalHeadless.Root>
  );
}
```

## Creating a Reusable Color Picker Modal

```jsx
import { ColorPickerModalHeadless } from 'strive-ui';

function CustomColorPicker({ 
  isOpen, 
  onClose, 
  initialColor = '#000000',
  onColorSelect,
  title = 'Select Color'
}) {
  return (
    <ColorPickerModalHeadless.Root
      open={isOpen}
      onClose={onClose}
      defaultColor={initialColor}
      onSelect={(colorValue) => {
        onColorSelect(colorValue);
      }}
    >
      <ColorPickerModalHeadless.Portal>
        <ColorPickerModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        
        <ColorPickerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '320px',
            zIndex: 1001
          }}
        >
          <ColorPickerModalHeadless.Content>
            <ColorPickerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>{title}</h3>
              <ColorPickerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </ColorPickerModalHeadless.Close>
            </ColorPickerModalHeadless.Header>
            
            <ColorPickerModalHeadless.Body
              style={{
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <ColorPickerModalHeadless.Preview
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>
                <div style={{ marginLeft: '16px', width: '120px' }}>
                  <ColorPickerModalHeadless.HexInput
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Hue</label>
                <ColorPickerModalHeadless.HueSlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px',
                    appearance: 'none',
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Saturation</label>
                <ColorPickerModalHeadless.SaturationSlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Lightness</label>
                <ColorPickerModalHeadless.LightnessSlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Opacity</label>
                <ColorPickerModalHeadless.OpacitySlider
                  label=""
                  style={{
                    width: '100%',
                    height: '24px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Presets</label>
                <ColorPickerModalHeadless.Presets
                  label=""
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                />
              </div>
            </ColorPickerModalHeadless.Body>
            
            <ColorPickerModalHeadless.Footer
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <ColorPickerModalHeadless.Close
                as="button"
                style={{
                  padding: '8px 16px',
                  background: '#f1f1f1',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </ColorPickerModalHeadless.Close>
              <ColorPickerModalHeadless.Select
                style={{
                  padding: '8px 16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Select
              </ColorPickerModalHeadless.Select>
            </ColorPickerModalHeadless.Footer>
          </ColorPickerModalHeadless.Content>
        </ColorPickerModalHeadless.Container>
      </ColorPickerModalHeadless.Portal>
    </ColorPickerModalHeadless.Root>
  );
}

// Usage
function App() {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#3498db');
  
  return (
    <div>
      <div 
        style={{ 
          backgroundColor: selectedColor,
          width: '40px',
          height: '40px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => setIsColorPickerOpen(true)}
      />
      
      <p>Selected color: {selectedColor}</p>
      
      <CustomColorPicker
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        initialColor={selectedColor}
        onColorSelect={(colorValue) => {
          setSelectedColor(colorValue.hex);
          setIsColorPickerOpen(false);
        }}
        title="Choose a Color"
      />
    </div>
  );
}
```

## Creating a Color Picker with Custom Presets

```jsx
import { ColorPickerModalHeadless } from 'strive-ui';

function ColorPickerWithCustomPresets() {
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const customPresets = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6'
  ];

  return (
    <ColorPickerModalHeadless.Root
      defaultColor={selectedColor}
      onChange={(colorValue) => console.log('Color changed:', colorValue)}
      onSelect={(colorValue) => {
        setSelectedColor(colorValue.hex);
      }}
    >
      <ColorPickerModalHeadless.Trigger
        style={{
          backgroundColor: selectedColor,
          width: '40px',
          height: '40px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      />
      
      <ColorPickerModalHeadless.Portal>
        <ColorPickerModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        
        <ColorPickerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '320px',
            zIndex: 1001
          }}
        >
          <ColorPickerModalHeadless.Content>
            <ColorPickerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>Brand Colors</h3>
              <ColorPickerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </ColorPickerModalHeadless.Close>
            </ColorPickerModalHeadless.Header>
            
            <ColorPickerModalHeadless.Body
              style={{
                padding: '16px'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <ColorPickerModalHeadless.Preview
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <ColorPickerModalHeadless.HexInput
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Brand Colors</label>
                <ColorPickerModalHeadless.Presets
                  label=""
                  presets={customPresets}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                  renderPreset={({ color, presetProps }) => (
                    <div
                      {...presetProps}
                      style={{
                        ...presetProps.style,
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                    >
                      {color === selectedColor && (
                        <div
                          style={{
                            position: 'absolute',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: color === '#ffffff' ? '#000' : '#fff'
                          }}
                        />
                      )}
                    </div>
                  )}
                />
              </div>
            </ColorPickerModalHeadless.Body>
            
            <ColorPickerModalHeadless.Footer
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <ColorPickerModalHeadless.Select
                style={{
                  padding: '8px 16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Select
              </ColorPickerModalHeadless.Select>
            </ColorPickerModalHeadless.Footer>
          </ColorPickerModalHeadless.Content>
        </ColorPickerModalHeadless.Container>
      </ColorPickerModalHeadless.Portal>
    </ColorPickerModalHeadless.Root>
  );
}
```

## API

### ColorPickerModalHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultColor` | `string` | `'#000000'` | Initial color value |
| `color` | `string` | - | Controlled color value |
| `onChange` | `(color: ColorValue) => void` | - | Callback when color changes |
| `onSelect` | `(color: ColorValue) => void` | - | Callback when color is selected |
| `format` | `'hex' \| 'rgb' \| 'rgba' \| 'hsl' \| 'hsla'` | `'hex'` | Color format to display |
| `showOpacity` | `boolean` | `true` | Whether to show opacity slider |
| `showPresets` | `boolean` | `true` | Whether to show color presets |
| `presets` | `string[]` | `[...]` | Color presets |
| `showRgbSliders` | `boolean` | `true` | Whether to show RGB sliders |
| `showHslSliders` | `boolean` | `true` | Whether to show HSL sliders |
| `showHexInput` | `boolean` | `true` | Whether to show hex input |
| `showRgbInputs` | `boolean` | `true` | Whether to show RGB inputs |
| `showHslInputs` | `boolean` | `true` | Whether to show HSL inputs |
| `showPreview` | `boolean` | `true` | Whether to show color preview |
| `showPicker` | `boolean` | `true` | Whether to show color picker |
| `showCloseButton` | `boolean` | `true` | Whether to show a close button |
| `showSelectButton` | `boolean` | `true` | Whether to show a select button |
| `closeOnSelect` | `boolean` | `true` | Whether to close the modal when a color is selected |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the modal when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the modal when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the modal |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the body when the modal is open |
| `usePortal` | `boolean` | `true` | Whether to render the modal in a portal |
| `portalId` | `string` | `'color-picker-modal-root'` | ID of the element to render the portal into |

### Other Components

- `ColorPickerModalHeadless.Trigger`: Button that opens the color picker modal
- `ColorPickerModalHeadless.Portal`: Portal container for the color picker modal
- `ColorPickerModalHeadless.Backdrop`: Background overlay for the color picker modal
- `ColorPickerModalHeadless.Container`: Container for the color picker modal
- `ColorPickerModalHeadless.Content`: Content container for the color picker modal
- `ColorPickerModalHeadless.Header`: Header section of the color picker modal
- `ColorPickerModalHeadless.Body`: Body section of the color picker modal
- `ColorPickerModalHeadless.Footer`: Footer section of the color picker modal
- `ColorPickerModalHeadless.Close`: Button that closes the color picker modal
- `ColorPickerModalHeadless.Select`: Button that selects the current color
- `ColorPickerModalHeadless.Preview`: Preview of the current color
- `ColorPickerModalHeadless.HueSlider`: Slider for adjusting the hue value
- `ColorPickerModalHeadless.SaturationSlider`: Slider for adjusting the saturation value
- `ColorPickerModalHeadless.LightnessSlider`: Slider for adjusting the lightness value
- `ColorPickerModalHeadless.OpacitySlider`: Slider for adjusting the opacity value
- `ColorPickerModalHeadless.RedSlider`: Slider for adjusting the red value
- `ColorPickerModalHeadless.GreenSlider`: Slider for adjusting the green value
- `ColorPickerModalHeadless.BlueSlider`: Slider for adjusting the blue value
- `ColorPickerModalHeadless.HexInput`: Input for entering a hex color value
- `ColorPickerModalHeadless.FormatSelector`: Selector for choosing the color format
- `ColorPickerModalHeadless.ColorValue`: Display of the current color value
- `ColorPickerModalHeadless.Presets`: Display of color presets

### useColorPickerModal Hook

For even more control, you can use the `useColorPickerModal` hook directly:

```jsx
import { useColorPickerModal } from 'strive-ui';

function MyCustomColorPicker() {
  const {
    isOpen,
    open,
    close,
    toggle,
    colorValue,
    setColorValue,
    format,
    setFormat,
    formattedColor,
    selectColor,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getSelectButtonProps,
    getPreviewProps,
    getHueSliderProps,
    getSaturationSliderProps,
    getLightnessSliderProps,
    getOpacitySliderProps,
    getRedSliderProps,
    getGreenSliderProps,
    getBlueSliderProps,
    getHexInputProps,
    getPresetProps,
  } = useColorPickerModal({
    defaultColor: '#3498db',
    format: 'hex',
    showOpacity: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Color Picker Modal component follows WAI-ARIA best practices for dialogs:

- The color picker modal container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the color picker modal when open
- Focus is restored to the trigger element when the color picker modal closes
- The escape key can be used to close the color picker modal
- Color presets have appropriate ARIA labels for screen readers
