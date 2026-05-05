'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Nachricht erfolgreich gesendet!')
        reset()
      } else {
        toast.error(result.error || 'Ein Fehler ist aufgetreten')
      }
    } catch {
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-accent" />
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Kontaktieren Sie uns
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Wir freuen uns auf Ihre Nachricht
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                {...register('name')}
                error={errors.name?.message}
                placeholder="Ihr Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                E-Mail *
              </label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="ihre@email.de"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Telefon
              </label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+49 123 456789"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                Betreff
              </label>
              <Input
                id="subject"
                {...register('subject')}
                placeholder="Worum geht es?"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Nachricht *
            </label>
            <Textarea
              id="message"
              {...register('message')}
              error={errors.message?.message}
              placeholder="Ihre Nachricht..."
              rows={5}
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting}>
              {!isSubmitting && <Send className="mr-2 h-4 w-4" />}
              Nachricht senden
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
