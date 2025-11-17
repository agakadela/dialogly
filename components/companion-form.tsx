'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { subjects } from '@/constants';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  topic: z.string().min(1, { message: 'Topic is required' }),
  voice: z.string().min(1, { message: 'Voice is required' }),
  style: z.string().min(1, { message: 'Style is required' }),
  duration: z.number().min(1, { message: 'Duration is required' }),
}) satisfies z.ZodType<CreateCompanion>;

export default function CompanionForm() {
  const form = useForm<CreateCompanion>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      subject: '',
      topic: '',
      voice: '',
      style: '',
      duration: 30,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='e.g. Neura the Brainy Explorer'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='subject'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className='input capitalize'>
                    <SelectValue placeholder='Select a subject' />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: string) => (
                      <SelectItem
                        key={subject}
                        value={subject}
                        className='capitalize'
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='topic'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g. Introduction to Algebra' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='voice'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className='input'>
                    <SelectValue placeholder='Select a voice' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key='male' value='male'>
                      Male
                    </SelectItem>
                    <SelectItem key='female' value='female'>
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='style'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className='input'>
                    <SelectValue placeholder='Select a style' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key='casual' value='casual'>
                      Casual
                    </SelectItem>
                    <SelectItem key='formal' value='formal'>
                      Formal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='duration'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration in minutes</FormLabel>
              <FormControl>
                <Input {...field} type='number' min={1} max={120} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='btn-primary w-full justify-center cursor-pointer'
        >
          Create Companion
        </Button>
      </form>
    </Form>
  );
}
