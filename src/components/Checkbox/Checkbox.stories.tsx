import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Checkbox, CheckboxProps } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
    isError: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    errorText: {
      control: 'text',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    onChange: { action: 'changed' },
  },
} as Meta;

const Template: Story<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Default Checkbox',
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'Checked Checkbox',
  checked: true,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  label: 'Indeterminate Checkbox',
  indeterminate: true,
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  label: 'Checkbox with Helper Text',
  helperText: 'This is a helper text',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Checkbox with Error',
  isError: true,
  errorText: 'This field is required',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Checkbox',
  isDisabled: true,
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  label: 'Disabled Checked Checkbox',
  checked: true,
  isDisabled: true,
};

export const Small = Template.bind({});
Small.args = {
  label: 'Small Checkbox',
  size: 'sm',
};

export const Medium = Template.bind({});
Medium.args = {
  label: 'Medium Checkbox',
  size: 'md',
};

export const Large = Template.bind({});
Large.args = {
  label: 'Large Checkbox',
  size: 'lg',
};

export const CheckboxGroup: Story = () => {
  const [checkedItems, setCheckedItems] = React.useState({
    option1: false,
    option2: true,
    option3: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox
        name="option1"
        label="Option 1"
        checked={checkedItems.option1}
        onChange={handleChange}
      />
      <Checkbox
        name="option2"
        label="Option 2"
        checked={checkedItems.option2}
        onChange={handleChange}
      />
      <Checkbox
        name="option3"
        label="Option 3"
        checked={checkedItems.option3}
        onChange={handleChange}
      />
    </div>
  );
};
