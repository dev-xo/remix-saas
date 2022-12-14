import { z } from 'zod'

export const LoginFormSchema = z.object({
	email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
	password: z.string().min(1, 'Password is required.'),
})

export const RegisterFormSchema = z
	.object({
		name: z.string().min(1, 'Name is required.'),
		email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
		password: z.string().min(1, 'Password is required.'),
		confirmPassword: z.string().min(1, 'Confirm Password is required.'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords does not match.',
		path: ['confirmPassword'],
	})

export const RequestFormSchema = z.object({
	email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
})

export const ResetFormSchema = z
	.object({
		password: z.string().min(1, 'Password is required.'),
		confirmPassword: z.string().min(1, 'Confirm password is required.'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords does not match.',
		path: ['confirmPassword'],
	})
