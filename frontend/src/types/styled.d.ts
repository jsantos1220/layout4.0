import 'styled-components'

declare module 'styled-components' {
	export interface DefaultTheme {
		primary: string
		primaryDark: string
		primaryLight: string
		secondary: string
		secondaryDark: string
		secondaryLight: string
		background: string
		backgroundLight: string
		border: string
		grey: string
		textTnput: string
		text: string
		text2: string

		danger: string
		dangerDark: string
		dangerBg: string
		success: string
		successBg: string
		warning: string
		warningBg: string

		// Typography
		fontFamily: string
		text_xs: string
		text_s: string
		text_m: string
		text_l: string
		text_xl: string
		text_2xl: string
		text_3xl: string
		text_4xl: string

		// Spacing
		space_4xs: string
		space_3xs: string
		space_2xs: string
		space_xs: string
		space_s: string
		space_m: string
		space_l: string
		space_xl: string
		space_2xl: string
		space_3xl: string
		space_4xl: string

		//Columns
		columns_1: string
		columns_2: string
		columns_3: string
		columns_4: string
		columns_5: string
		columns_6: string
		columns_7: string
		columns_8: string

		// Shadows
		shadow_xs: string
		shadow_s: string
		shadow_m: string
		shadow_l: string
		shadow_xl: string
	}
}
