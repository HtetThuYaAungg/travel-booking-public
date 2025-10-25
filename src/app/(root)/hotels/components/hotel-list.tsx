"use client";

import { useGetAllHotelsByFilter } from "@/api-config/queries/hotel";
import { useState, useRef, useCallback } from "react";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import { useEffect } from "react";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lock, MapPin, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
};

export function HotelList({ filter, setFilter }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [allHotels, setAllHotels] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filterKey, setFilterKey] = useState(0); // Key to force reset
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFilterResetRef = useRef(false); // Track if we're in a filter reset
  const lastLoadedPageRef = useRef(0); // Track last loaded page to prevent duplicates
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when filters change
  useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Set flag to indicate we're in a filter reset
    isFilterResetRef.current = true;
    
    // Clear existing hotels immediately and force reset
    setAllHotels([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    setIsInitialLoad(true);
    setFilterKey(prev => prev + 1); // Force component reset
    lastLoadedPageRef.current = 0; // Reset last loaded page
    
    // Set a timeout to handle cases where API doesn't respond
    loadingTimeoutRef.current = setTimeout(() => {
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setHasMore(false);
      }
    }, 10000); // 10 second timeout
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [
    filter.search,
    filter.city,
    filter.country,
    filter.min_price,
    filter.max_price,
    filter.min_star_rating,
    filter.min_rating,
    filter.has_wifi,
    filter.has_pool,
    filter.has_spa,
    filter.has_gym,
    filter.has_restaurant,
    filter.has_parking,
    filter.has_pet_friendly,
    filter.sort_by,
    filter.sort_order
  ]);

  const {
    data: hotelList,
    isLoading: isHotelListLoading,
    error,
  } = useGetAllHotelsByFilter({
    ...filter,
    page: currentPage,
    limit: defaultPageSize,
  });

  // Handle data updates
  useEffect(() => {
    // Clear timeout when data arrives
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    if (hotelList?.data?.items) {
      // Check if we've already loaded this page to prevent duplicates
      // But allow page 1 to load if we're in a filter reset
      if (lastLoadedPageRef.current >= currentPage && !isFilterResetRef.current) {
        console.log('Skipping duplicate page load:', { currentPage, lastLoaded: lastLoadedPageRef.current });
        return; // Skip if we've already loaded this page and not in filter reset
      }
      
      console.log('Processing hotel data:', { 
        currentPage, 
        itemsCount: hotelList.data.items.length, 
        isFilterReset: isFilterResetRef.current,
        lastLoaded: lastLoadedPageRef.current 
      });
      
      // Always replace data when on page 1 (first load or filter reset)
      if (currentPage === 1) {
        // Use functional update to ensure we replace completely
        setAllHotels(() => hotelList.data.items);
        setIsInitialLoad(false);
        isFilterResetRef.current = false; // Reset the flag
        lastLoadedPageRef.current = 1; // Mark page 1 as loaded
      } else {
        // Only append for subsequent pages
        setAllHotels(prev => [...prev, ...hotelList.data.items]);
        lastLoadedPageRef.current = currentPage; // Mark this page as loaded
      }
      
      // Check if there are more pages
      const totalPages = Math.ceil((hotelList.data.total || 0) / defaultPageSize);
      setHasMore(currentPage < totalPages);
      setIsLoadingMore(false);
    } else if (hotelList?.data && hotelList.data.items?.length === 0) {
      // Handle case when API returns empty results (no hotels found)
      console.log('No hotels found for current filters');
      if (currentPage === 1) {
        setAllHotels([]);
        setIsInitialLoad(false);
        isFilterResetRef.current = false;
        lastLoadedPageRef.current = 1;
      }
      setHasMore(false);
      setIsLoadingMore(false);
    } else if (error) {
      console.log('Error loading hotels:', error);
      setIsInitialLoad(false);
      setIsLoadingMore(false);
    }
  }, [hotelList, currentPage, error]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isHotelListLoading) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMore, isHotelListLoading]);

  // Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isHotelListLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, isHotelListLoading, loadMore]);

  if (error) {
    return (
      <FetchErrorAlert
        title="Error"
        description="Failed to load hotel data. Please try again."
      />
    );
  }

  console.log("allHotels", allHotels);

  return (
    <>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Hotels</h2>
          <p className="text-primary">
            We found {hotelList?.data.total || 0} hotels.
          </p>
        </div>

        {/* Loading state for initial load */}
        {(isHotelListLoading && allHotels.length === 0) || isInitialLoad ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-active" />
            <span className="ml-2 text-primary">Loading hotels...</span>
          </div>
        ) : null}

        <div className="space-y-6" key={filterKey}>
          {allHotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row px-6">
                {/* Hotel Image */}
                <div className="md:w-1/3">
                  <img
                    src={hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"}
                    alt={hotel.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Hotel Details */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(hotel.star_rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-active fill-current"
                          />
                        ))}
                        <span className="ml-2 text-sm text-primary">
                          {hotel.rating} Star Hotel
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-primary mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{hotel.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-active">
                        ${hotel.price}/USD
                      </div>
                      <div className="text-sm text-primary">per night</div>
                    </div>
                  </div>

                  <p className="text-primary mb-6 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/hotels/${hotel.id}`)}
                    >
                      View Details
                    </Button>
                    {isAuthenticated ? (
                      <Button
                        className="flex-1 bg-active/80 hover:bg-active text-white"
                        onClick={() => router.push(`/hotels/${hotel.id}`)}
                      >
                        Book Now
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1"
                        disabled
                        title="Please sign in to book"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Sign in to Book
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Manual Load More Button */}
        {hasMore && allHotels.length > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMore}
              disabled={isLoadingMore || isHotelListLoading}
              variant="outline"
              size="lg"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading more...
                </>
              ) : (
                <>
                  Load More Hotels
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Scroll trigger element for infinite scroll */}
        {hasMore && !isLoadingMore && allHotels.length > 0 && (
          <div ref={loadMoreRef} className="h-10" />
        )}

        {/* No more hotels message */}
        {!hasMore && allHotels.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You've reached the end of the list</p>
          </div>
        )}

        {/* No hotels found */}
        {!isHotelListLoading && allHotels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No hotels found matching your criteria.
            </div>
            <p className="text-gray-400 mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
