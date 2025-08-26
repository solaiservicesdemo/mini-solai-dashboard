import { useState, useEffect, useCallback, useMemo } from "react"
import { Check, ChevronsUpDown, User, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { fetchClientProfiles, searchClientProfiles, ClientOption } from "@/lib/clientProfilesService"

interface ClientDropdownProps {
  value: string
  onValueChange: (email: string, clientName?: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ClientDropdown({
  value,
  onValueChange,
  placeholder = "Select client...",
  disabled = false,
  className
}: ClientDropdownProps) {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // Find the selected client
  const selectedClient = clients.find(client => client.email === value)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load initial client data
  useEffect(() => {
    if (open && clients.length === 0) {
      loadClients()
    }
  }, [open])

  // Search clients when debounced query changes
  useEffect(() => {
    if (open) {
      searchClients(debouncedQuery)
    }
  }, [debouncedQuery, open])

  const loadClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchClientProfiles(50) // Limit initial load
      setClients(data)
    } catch (err) {
      setError('Failed to load clients')
      console.error('Error loading clients:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchClients = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchClientProfiles(query)
      setClients(data)
    } catch (err) {
      setError('Failed to search clients')
      console.error('Error searching clients:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSelect = (client: ClientOption) => {
    onValueChange(client.email, client.name)
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery("")
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedClient ? (
            <div className="flex items-center space-x-2 overflow-hidden">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">{selectedClient.name}</span>
              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">({selectedClient.email})</span>
            </div>
          ) : value ? (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[400px] max-h-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search clients or enter email..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="client-dropdown-scroll">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Loading clients...</span>
              </div>
            )}
            
            {error && (
              <div className="px-4 py-6 text-center text-sm text-destructive">
                {error}
              </div>
            )}
            
            {!loading && !error && (
              <>
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground">No clients found.</p>
                    {searchQuery && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          onValueChange(searchQuery)
                          setOpen(false)
                        }}
                      >
                        Use "{searchQuery}" as email
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                
                {clients.length > 0 && (
                  <CommandGroup heading="Clients">
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={`${client.name} ${client.email}`}
                        onSelect={() => handleSelect(client)}
                        className="flex items-center space-x-2 py-2"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-medium truncate">{client.name}</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{client.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {searchQuery && !clients.some(c => c.email.toLowerCase() === searchQuery.toLowerCase()) && (
                  <CommandGroup heading="Custom Email">
                    <CommandItem
                      value={searchQuery}
                      onSelect={() => {
                        onValueChange(searchQuery)
                        setOpen(false)
                      }}
                      className="flex items-center space-x-2 py-2"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>Use "{searchQuery}" as email</span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
