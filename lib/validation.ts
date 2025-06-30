"use client"

import { useState } from "react"

// Validation rules
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

// Validation result
export interface ValidationResult {
  isValid: boolean
  errors: { [key: string]: string }
}

// Validate single field
export function validateField(value: any, rules: ValidationRule): string | null {
  if (rules.required && (!value || (typeof value === "string" && value.trim() === ""))) {
    return "This field is required"
  }

  if (value && typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return "Invalid format"
    }
  }

  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

// Validate form
export function validateForm(data: any, rules: ValidationRules): ValidationResult {
  const errors: { [key: string]: string } = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules)
    if (error) {
      errors[field] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
}

// Form validation hook
export function useFormValidation(initialData: any, rules: ValidationRules) {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (field: string, value: any) => {
    const rule = rules[field]
    if (rule) {
      const error = validateField(value, rule)
      setErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }))
    }
  }

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, data[field])
  }

  const validate = () => {
    const result = validateForm(data, rules)
    setErrors(result.errors)
    return result.isValid
  }

  const reset = () => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  }
}
