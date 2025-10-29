"use client";

import { useGetAllFlightsByFilter } from "@/api-config/queries/flight";
import { useState, useRef, useCallback } from "react";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import { useEffect } from "react";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lock, Plane, Clock, Users, Loader2, Wifi, Utensils, Headphones, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

type Props = {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
};

export function FlightList({ filter, setFilter }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [allFlights, setAllFlights] = useState<any[]>([]);
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
    
    // Clear existing flights immediately and force reset
    setAllFlights([]);
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
    filter.departure_airport_code,
    filter.arrival_airport_code,
    filter.departure_city,
    filter.arrival_city,
    filter.departure_country,
    filter.arrival_country,
    filter.departure_date,
    filter.arrival_date,
    filter.passengers,
    filter.min_price,
    filter.max_price,
    filter.airline_name,
    filter.airline_code,
    filter.aircraft_type,
    filter.class_type,
    filter.has_wifi,
    filter.has_meal,
    filter.has_entertainment,
    filter.has_luggage,
    filter.is_domestic,
    filter.min_duration,
    filter.max_duration,
    filter.sort_by,
    filter.sort_order
  ]);

  const {
    data: flightList,
    isLoading: isFlightListLoading,
    error,
  } = useGetAllFlightsByFilter({
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
    
    if (flightList?.data?.items) {
      // Check if we've already loaded this page to prevent duplicates
      // But allow page 1 to load if we're in a filter reset
      if (lastLoadedPageRef.current >= currentPage && !isFilterResetRef.current) {
        console.log('Skipping duplicate page load:', { currentPage, lastLoaded: lastLoadedPageRef.current });
        return; // Skip if we've already loaded this page and not in filter reset
      }
      
      console.log('Processing flight data:', { 
        currentPage, 
        itemsCount: flightList.data.items.length, 
        isFilterReset: isFilterResetRef.current,
        lastLoaded: lastLoadedPageRef.current 
      });
      
      // Always replace data when on page 1 (first load or filter reset)
      if (currentPage === 1) {
        // Use functional update to ensure we replace completely
        setAllFlights(() => flightList.data.items);
        setIsInitialLoad(false);
        isFilterResetRef.current = false; // Reset the flag
        lastLoadedPageRef.current = 1; // Mark page 1 as loaded
      } else {
        // Only append for subsequent pages
        setAllFlights(prev => [...prev, ...flightList.data.items]);
        lastLoadedPageRef.current = currentPage; // Mark this page as loaded
      }
      
      // Check if there are more pages
      const totalPages = Math.ceil((flightList.data.total || 0) / defaultPageSize);
      setHasMore(currentPage < totalPages);
      setIsLoadingMore(false);
    } else if (flightList?.data && flightList.data.items?.length === 0) {
      // Handle case when API returns empty results (no flights found)
      console.log('No flights found for current filters');
      if (currentPage === 1) {
        setAllFlights([]);
        setIsInitialLoad(false);
        isFilterResetRef.current = false;
        lastLoadedPageRef.current = 1;
      }
      setHasMore(false);
      setIsLoadingMore(false);
    } else if (error) {
      console.log('Error loading flights:', error);
      setIsInitialLoad(false);
      setIsLoadingMore(false);
    }
  }, [flightList, currentPage, error]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isFlightListLoading) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMore, isFlightListLoading]);

  // Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isFlightListLoading) {
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
  }, [hasMore, isLoadingMore, isFlightListLoading, loadMore]);

  if (error) {
    return (
      <FetchErrorAlert
        title="Error"
        description="Failed to load flight data. Please try again."
      />
    );
  }

  console.log("allFlights", allFlights);

  return (
    <>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Flights</h2>
          <p className="text-primary">
            We found {flightList?.data.total || 0} flights.
          </p>
        </div>

        {/* Loading state for initial load */}
        {(isFlightListLoading && allFlights.length === 0) || isInitialLoad ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-active" />
            <span className="ml-2 text-primary">Loading flights...</span>
          </div>
        ) : null}

        <div className="space-y-6" key={filterKey}>
          {allFlights.map((flight) => (
            <Card
              key={flight.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Flight Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">
                      {flight.airline_name}
                    </h3>
                    <p className="text-sm text-primary/50">
                      {flight.flight_number} • {flight.aircraft_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-active">
                      ${flight.base_price} {flight.currency}
                    </div>
                    <div className="text-sm text-primary/50">
                      {flight.class_type}
                    </div>
                  </div>
                </div>

                {/* Flight Route */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {flight.departure_time_formatted}
                    </div>
                    <div className="text-sm text-primary/50">
                      {flight.departure_airport_code}
                    </div>
                    <div className="text-xs text-primary/50">
                      {flight.departure_city}
                    </div>
                  </div>
                  
                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="mx-2 flex items-center">
                        <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-center mt-1">
                      <div className="text-xs text-primary/50">
                        {flight.duration_formatted}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {flight.arrival_time_formatted}
                    </div>
                    <div className="text-sm text-primary/50">
                      {flight.arrival_airport_code}
                    </div>
                    <div className="text-xs text-primary/50">
                      {flight.arrival_city}
                    </div>
                  </div>
                </div>

                {/* Flight Amenities */}
                <div className="flex items-center space-x-4 mb-4">
                  {flight.has_wifi && (
                    <div className="flex items-center text-xs text-primary/50">
                      <Wifi className="w-3 h-3 mr-1" />
                      WiFi
                    </div>
                  )}
                  {flight.has_meal && (
                    <div className="flex items-center text-xs text-primary/50">
                      <Utensils className="w-3 h-3 mr-1" />
                      Meal
                    </div>
                  )}
                  {flight.has_entertainment && (
                    <div className="flex items-center text-xs text-primary/50">
                      <Headphones className="w-3 h-3 mr-1" />
                      Entertainment
                    </div>
                  )}
                  {flight.has_luggage && (
                    <div className="flex items-center text-xs text-primary/50">
                      <Luggage className="w-3 h-3 mr-1" />
                      Luggage
                    </div>
                  )}
                </div>

                {/* Available Seats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-primary/50">
                    <Users className="w-4 h-4 inline mr-1" />
                    {flight.available_seats} seats left
                  </div>
                  <div className="text-sm text-gray-600">
                    {flight.route}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/flights/${flight.id}`)}
                  >
                    View Details
                  </Button>
                  {isAuthenticated ? (
                    <Button
                      className="flex-1 bg-active/80 hover:bg-active text-white"
                      onClick={() => router.push(`/flights/${flight.id}`)}
                    >
                      Book Flight
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
            </Card>
          ))}
        </div>

        {/* Manual Load More Button */}
        {hasMore && allFlights.length > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMore}
              disabled={isLoadingMore || isFlightListLoading}
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
                  Load More Flights
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Scroll trigger element for infinite scroll */}
        {hasMore && !isLoadingMore && allFlights.length > 0 && (
          <div ref={loadMoreRef} className="h-10" />
        )}

        {/* No more flights message */}
        {!hasMore && allFlights.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You've reached the end of the list</p>
          </div>
        )}

        {/* No flights found */}
        {!isFlightListLoading && allFlights.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No flights found matching your criteria.
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
