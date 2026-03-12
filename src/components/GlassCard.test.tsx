import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GlassCard from './GlassCard'

describe('GlassCard', () => {
    it('renders children correctly', () => {
        render(<GlassCard>Test Content</GlassCard>)
        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<GlassCard className="custom-class">Test Content</GlassCard>)
        expect(container.firstChild).toHaveClass('custom-class')
        expect(container.firstChild).toHaveClass('glass')
    })
})
