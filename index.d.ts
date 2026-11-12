// Type definitions for echarts-liquidfill
// The plugin is registered by importing it for side effects:
//   import 'echarts-liquidfill';

export type LiquidFillDirection = 'left' | 'right' | 'none';

export type LiquidFillShape =
    | 'circle'
    | 'rect'
    | 'roundRect'
    | 'triangle'
    | 'diamond'
    | 'pin'
    | 'arrow'
    | 'container'
    | string;

export interface LiquidFillStyleOption {
    color?: string;
    opacity?: number;
    shadowBlur?: number;
    shadowColor?: string;
    borderColor?: string;
    borderWidth?: number;
    [key: string]: any;
}

export interface LiquidFillLabelOption {
    show?: boolean;
    color?: string;
    /** Color of the text part that overlaps the waves. */
    insideColor?: string;
    fontSize?: number;
    fontWeight?: string | number;
    fontFamily?: string;
    align?: 'left' | 'center' | 'right';
    baseline?: 'top' | 'middle' | 'bottom';
    position?:
        | 'inside'
        | 'left'
        | 'right'
        | 'top'
        | 'bottom'
        | Array<string | number>;
    formatter?: string | ((params: any) => string);
    [key: string]: any;
}

export interface LiquidFillEmphasisOption {
    itemStyle?: LiquidFillStyleOption;
    [key: string]: any;
}

export interface LiquidFillOutlineOption {
    show?: boolean;
    /** Distance between the outline and the inner shape. */
    borderDistance?: number;
    itemStyle?: LiquidFillStyleOption;
}

export interface LiquidFillBackgroundStyleOption {
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    shadowBlur?: number;
    shadowColor?: string;
    opacity?: number;
    [key: string]: any;
}

export interface LiquidFillDataItem {
    name?: string;
    /** Value of the wave, between 0 and 1. */
    value: number;
    direction?: LiquidFillDirection;
    phase?: number | 'auto';
    period?: number | 'auto' | ((value: number, index: number) => number);
    amplitude?: number | string;
    waveLength?: number | string;
    itemStyle?: LiquidFillStyleOption;
    emphasis?: LiquidFillEmphasisOption;
}

export interface LiquidFillSeriesOption {
    type: 'liquidFill';
    name?: string;
    data?: Array<number | LiquidFillDataItem>;
    /** Wave colors. */
    color?: string[];
    shape?: LiquidFillShape;
    center?: Array<string | number>;
    radius?: string | number;
    /** Wave amplitude, in pixels or percentage of the diameter. */
    amplitude?: number | string;
    /** Wave length, in pixels or percentage of the diameter. */
    waveLength?: number | string;
    /** Phase of the wave, in radians, or 'auto'. */
    phase?: number | 'auto';
    /** Milliseconds for a wave to move forward a wave length. */
    period?: number | 'auto' | ((value: number, index: number) => number);
    direction?: LiquidFillDirection;
    waveAnimation?: boolean;
    animationEasing?: string;
    animationEasingUpdate?: string;
    animationDuration?: number;
    animationDurationUpdate?: number;
    outline?: LiquidFillOutlineOption;
    backgroundStyle?: LiquidFillBackgroundStyleOption;
    itemStyle?: LiquidFillStyleOption;
    label?: LiquidFillLabelOption;
    emphasis?: LiquidFillEmphasisOption;
    silent?: boolean;
    [key: string]: any;
}

export interface LiquidFillOption {
    series?: LiquidFillSeriesOption | LiquidFillSeriesOption[];
    [key: string]: any;
}
