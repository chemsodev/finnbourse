"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RelatedUserFormValues, relatedUserFormSchema } from "./schema";

const usersFormSchema = z.object({
  users: z.array(relatedUserFormSchema),
});

type UsersFormValues = z.infer<typeof usersFormSchema>;

interface EnhancedAgenceUsersFormProps {
  defaultValues: UsersFormValues;
  onFormChange: (users: RelatedUserFormValues[]) => void;
  entityName?: string;
}

export function EnhancedAgenceUsersForm({
  defaultValues,
  onFormChange,
  entityName = "Agency",
}: EnhancedAgenceUsersFormProps) {
  const [isAddingUser, setIsAddingUser] = useState(false);

  const form = useForm<UsersFormValues>({
    resolver: zodResolver(usersFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  const { watch } = form;

  // Watch for form changes and propagate them up
  useEffect(() => {
    const subscription = watch((value) => {
      if (value?.users) {
        onFormChange(value.users as RelatedUserFormValues[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  // Update form when defaultValues change
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const addUser = () => {
    setIsAddingUser(true);
    append({
      id: undefined,
      fullName: "",
      email: "",
      password: "",
      phone: "",
      position: "",
      roles: [],
      status: "active",
    });
    setIsAddingUser(false);
  };

  const removeUser = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User Management for {entityName}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Add and configure users who will be associated with this agency. These
          users will have access to the agency&apos;s operations and data.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {fields.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users added yet
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Add users who will be associated with this{" "}
                  {entityName.toLowerCase()}.
                </p>
                <Button
                  type="button"
                  onClick={addUser}
                  disabled={isAddingUser}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First User
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-800">
                  Users ({fields.length})
                </h4>
                <Button
                  type="button"
                  onClick={addUser}
                  disabled={isAddingUser}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">
                        User {index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUser(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`users.${index}.fullName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`users.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter email address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`users.${index}.password`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`users.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`users.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter position/title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`users.${index}.status`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </Form>

      {fields.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> All added users will be created with default
            roles. You can modify their roles and permissions after the agency
            is created.
          </p>
        </div>
      )}
    </div>
  );
}
