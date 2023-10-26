'use client'

import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import axios from 'axios'

import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'

import FileUpload from '../FileUpload'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '../../hooks/use-modal-store'
import { useEffect } from 'react'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required.',
  }),
})

export default function EditServerModal() {
  const { type, data, isOpen, onClose } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'editServer'
  const { server } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
    // the onClose(), here, required that i click on "Server Settings" TWICE before it would/could open the modal
  }, [server, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values) // we're targetting a SPECIFIC server (based on its id) for updating purposes

      form.reset()
      router.refresh()
      // why no window.location.reload()?
      onClose() // the onClose(), here, is crucial!
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    // why no router.refresh()?
    onClose()
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="text-black bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field} // this supplies our form with onChange, onBlur, and the onFocus "handlers" (just to name a few) => react-hook-form
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                disabled={isLoading}
                variant="primary" // OUR ADDITION
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
