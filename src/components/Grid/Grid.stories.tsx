import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Grid } from './Grid';
import styled from 'styled-components';

export default {
  title: 'Components/Grid',
  component: Grid.Container,
  parameters: {
    docs: {
      description: {
        component: 'Grid system for creating responsive layouts.'
      }
    }
  }
} as Meta;

const DemoBox = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border: 1px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  height: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BasicGrid = () => (
  <Grid.Container>
    <Grid.Row spacing={2}>
      <Grid.Item xs={12} md={6} lg={4}>
        <DemoBox>xs=12 md=6 lg=4</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={6} lg={4}>
        <DemoBox>xs=12 md=6 lg=4</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={6} lg={4}>
        <DemoBox>xs=12 md=6 lg=4</DemoBox>
      </Grid.Item>
    </Grid.Row>
  </Grid.Container>
);

export const ResponsiveGrid = () => (
  <Grid.Container>
    <Grid.Row spacing={2}>
      <Grid.Item xs={12}>
        <DemoBox>xs=12</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} sm={6}>
        <DemoBox>xs=12 sm=6</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} sm={6}>
        <DemoBox>xs=12 sm=6</DemoBox>
      </Grid.Item>
      <Grid.Item xs={6} sm={3} md={2}>
        <DemoBox>xs=6 sm=3 md=2</DemoBox>
      </Grid.Item>
      <Grid.Item xs={6} sm={3} md={2}>
        <DemoBox>xs=6 sm=3 md=2</DemoBox>
      </Grid.Item>
      <Grid.Item xs={6} sm={3} md={2}>
        <DemoBox>xs=6 sm=3 md=2</DemoBox>
      </Grid.Item>
      <Grid.Item xs={6} sm={3} md={2}>
        <DemoBox>xs=6 sm=3 md=2</DemoBox>
      </Grid.Item>
      <Grid.Item xs={6} sm={3} md={2}>
        <DemoBox>xs=6 sm=3 md=2</DemoBox>
      </Grid.Item>
      <Grid.Item xs={6} sm={3} md={2}>
        <DemoBox>xs=6 sm=3 md=2</DemoBox>
      </Grid.Item>
    </Grid.Row>
  </Grid.Container>
);

export const NestedGrid = () => (
  <Grid.Container>
    <Grid.Row spacing={2}>
      <Grid.Item xs={12} md={8}>
        <DemoBox>xs=12 md=8</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={4}>
        <DemoBox>xs=12 md=4</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={4}>
        <DemoBox>xs=12 md=4</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={8}>
        <Grid.Row spacing={2}>
          <Grid.Item xs={6}>
            <DemoBox>Nested xs=6</DemoBox>
          </Grid.Item>
          <Grid.Item xs={6}>
            <DemoBox>Nested xs=6</DemoBox>
          </Grid.Item>
          <Grid.Item xs={12}>
            <DemoBox>Nested xs=12</DemoBox>
          </Grid.Item>
        </Grid.Row>
      </Grid.Item>
    </Grid.Row>
  </Grid.Container>
);

export const DifferentSpacing = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Spacing: 0</h3>
      <Grid.Container>
        <Grid.Row spacing={0}>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
        </Grid.Row>
      </Grid.Container>
    </div>
    
    <div>
      <h3>Spacing: 1</h3>
      <Grid.Container>
        <Grid.Row spacing={1}>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
        </Grid.Row>
      </Grid.Container>
    </div>
    
    <div>
      <h3>Spacing: 3</h3>
      <Grid.Container>
        <Grid.Row spacing={3}>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
        </Grid.Row>
      </Grid.Container>
    </div>
    
    <div>
      <h3>Responsive Spacing</h3>
      <Grid.Container>
        <Grid.Row spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
          <Grid.Item xs={4}>
            <DemoBox>xs=4</DemoBox>
          </Grid.Item>
        </Grid.Row>
      </Grid.Container>
    </div>
  </div>
);

export const FluidContainer = () => (
  <Grid.Container fluid>
    <Grid.Row spacing={2}>
      <Grid.Item xs={12} md={6} lg={3}>
        <DemoBox>xs=12 md=6 lg=3</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={6} lg={3}>
        <DemoBox>xs=12 md=6 lg=3</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={6} lg={3}>
        <DemoBox>xs=12 md=6 lg=3</DemoBox>
      </Grid.Item>
      <Grid.Item xs={12} md={6} lg={3}>
        <DemoBox>xs=12 md=6 lg=3</DemoBox>
      </Grid.Item>
    </Grid.Row>
  </Grid.Container>
);

export const ItemOrder = () => (
  <Grid.Container>
    <Grid.Row spacing={2}>
      <Grid.Item xs={4} order={3}>
        <DemoBox>1. order=3</DemoBox>
      </Grid.Item>
      <Grid.Item xs={4} order={1}>
        <DemoBox>2. order=1</DemoBox>
      </Grid.Item>
      <Grid.Item xs={4} order={2}>
        <DemoBox>3. order=2</DemoBox>
      </Grid.Item>
    </Grid.Row>
    
    <h3 style={{ marginTop: '2rem' }}>Responsive Order</h3>
    <Grid.Row spacing={2}>
      <Grid.Item xs={4} order={{ xs: 3, md: 1 }}>
        <DemoBox>1. xs:3, md:1</DemoBox>
      </Grid.Item>
      <Grid.Item xs={4} order={{ xs: 1, md: 2 }}>
        <DemoBox>2. xs:1, md:2</DemoBox>
      </Grid.Item>
      <Grid.Item xs={4} order={{ xs: 2, md: 3 }}>
        <DemoBox>3. xs:2, md:3</DemoBox>
      </Grid.Item>
    </Grid.Row>
  </Grid.Container>
);

export const AutoLayout = () => (
  <Grid.Container>
    <Grid.Row spacing={2}>
      <Grid.Item grow>
        <DemoBox>1. grow</DemoBox>
      </Grid.Item>
      <Grid.Item grow>
        <DemoBox>2. grow</DemoBox>
      </Grid.Item>
      <Grid.Item grow>
        <DemoBox>3. grow</DemoBox>
      </Grid.Item>
    </Grid.Row>
    
    <Grid.Row spacing={2} style={{ marginTop: '1rem' }}>
      <Grid.Item xs={3}>
        <DemoBox>1. xs=3</DemoBox>
      </Grid.Item>
      <Grid.Item grow>
        <DemoBox>2. grow</DemoBox>
      </Grid.Item>
      <Grid.Item xs={3}>
        <DemoBox>3. xs=3</DemoBox>
      </Grid.Item>
    </Grid.Row>
  </Grid.Container>
);
