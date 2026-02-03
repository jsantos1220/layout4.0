import styled from 'styled-components'

// The Button from the last section without the interpolations
export const Input = styled.input`
	width: 100%;
	height: 50px;
	border: 1px solid ${({ theme }) => theme.border};
	border-radius: 0px;
	padding: 0 10px;
	font-size: 16px;
	margin-top: 8px;
`

// A new component based on Button, but with some override styles
export const Input2 = styled(Input)`
	color: tomato;
	border-color: tomato;
`
