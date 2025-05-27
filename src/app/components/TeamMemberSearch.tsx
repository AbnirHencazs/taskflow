"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface TeamMemberSearchProps {
  projectId: string;
}

export function TeamMemberSearch({ projectId }: TeamMemberSearchProps) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));
  const containerRef = useRef<HTMLDivElement>(null);

  const searchUsers = useCallback(
    async (query: string) => {
      if (!query) {
        setUsers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_PATH
          }/api/users/search?q=${encodeURIComponent(
            query
          )}&projectId=${projectId}`
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError("Failed to search users");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  const addMember = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/projects/${projectId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add team member");
      }

      setIsOpen(false);
      setSearch("");
      setUsers([]);
    } catch (err) {
      setError("Failed to add team member");
      console.error("Add member error:", err);
    }
  };

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(search);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, searchUsers]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < users.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < users.length) {
          addMember(users[selectedIndex].id);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-[300px]">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by email..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          aria-label="Search team members"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `user-${users[selectedIndex]?.id}` : undefined
          }
          role="combobox"
          aria-autocomplete="list"
        />
        {loading && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {isOpen && (search || loading) && (
        <div
          id="search-results"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {loading ? (
            <div className="p-2 text-sm text-gray-500">Searching...</div>
          ) : users.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No users found</div>
          ) : (
            users.map((user, index) => (
              <div
                key={user.id}
                id={`user-${user.id}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`p-2 cursor-pointer text-sm ${
                  index === selectedIndex
                    ? "bg-indigo-100 text-indigo-900"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => addMember(user.id)}
              >
                {user.email}
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <div
          className="mt-1 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
