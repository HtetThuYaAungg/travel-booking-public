// "use client";
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Star, MapPin, ArrowRight, Lock } from "lucide-react";
// import { useAuth } from "@/app/contexts/AuthContext";

// interface HotelListProps {
//   filters: {
//     location: string;
//     priceRange: [number, number];
//     dateRange: { checkIn: string; checkOut: string };
//     guests: number;
//     rooms: number;
//     amenities: string[];
//   };
//   searchQuery: string;
// }

// export function HotelList({ filters, searchQuery }: HotelListProps) {
//   const { isAuthenticated } = useAuth();

//   const hotels = [
//     {
//       id: 1,
//       name: "Grand Palace Hotel",
//       price: 250,
//       rating: 5,
//       location: "Downtown, Yangon",
//       description: "Luxurious 5-star hotel in the heart of the city with stunning views and world-class amenities. Experience unparalleled comfort and service.",
//       image: "/api/placeholder/400/300",
//       stars: 5,
//     },
//     {
//       id: 2,
//       name: "Riverside Resort",
//       price: 180,
//       rating: 4,
//       location: "Riverside, Mandalay",
//       description: "Peaceful riverside retreat with beautiful gardens and spa facilities. Perfect for relaxation and rejuvenation.",
//       image: "/api/placeholder/400/300",
//       stars: 4,
//     },
//     {
//       id: 3,
//       name: "City Center Inn",
//       price: 120,
//       rating: 3,
//       location: "City Center, Yangon",
//       description: "Modern boutique hotel with contemporary design and excellent location. Walking distance to major attractions.",
//       image: "/api/placeholder/400/300",
//       stars: 3,
//     },
//     {
//       id: 4,
//       name: "Mountain View Lodge",
//       price: 95,
//       rating: 4,
//       location: "Shan Hills, Kalaw",
//       description: "Scenic mountain lodge offering breathtaking views and outdoor activities. Perfect for nature lovers and adventure seekers.",
//       image: "/api/placeholder/400/300",
//       stars: 4,
//     },
//     {
//       id: 5,
//       name: "Beach Paradise Resort",
//       price: 320,
//       rating: 5,
//       location: "Ngapali Beach",
//       description: "Tropical beachfront resort with pristine white sand beaches and crystal clear waters. Ultimate beach vacation destination.",
//       image: "/api/placeholder/400/300",
//       stars: 5,
//     },
//     {
//       id: 6,
//       name: "Heritage Boutique Hotel",
//       price: 160,
//       rating: 4,
//       location: "Old Bagan",
//       description: "Charming heritage hotel with traditional architecture and modern comforts. Rich cultural experience in historic setting.",
//       image: "/api/placeholder/400/300",
//       stars: 4,
//     },
//   ];

//   // Filter hotels based on search and filters
//   const filteredHotels = hotels.filter(hotel => {
//     const matchesSearch = searchQuery === "" ||
//       hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesPrice = hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1];

//     return matchesSearch && matchesPrice;
//   });

//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-primary mb-2">Hotels</h2>
//         <p className="text-primary">
//           We found {filteredHotels.length} hotels.
//         </p>
//       </div>

//       <div className="space-y-6">
//         {filteredHotels.map((hotel) => (
//           <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
//             <div className="flex flex-col md:flex-row">
//               {/* Hotel Image */}
//               <div className="md:w-1/3">
//                 <div className="w-full h-48 md:h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
//                   <span className="text-white text-lg font-semibold">Hotel Image</span>
//                 </div>
//               </div>

//               {/* Hotel Details */}
//               <div className="md:w-2/3 p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <div className="flex items-center mb-2">
//                       {[...Array(hotel.stars)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//                       ))}
//                       <span className="ml-2 text-sm text-gray-600">
//                         {hotel.stars} Star Hotel
//                       </span>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                       {hotel.name}
//                     </h3>
//                     <div className="flex items-center text-gray-600 mb-3">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       <span>{hotel.location}</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-3xl font-bold text-blue-600">
//                       ${hotel.price}/USD
//                     </div>
//                     <div className="text-sm text-gray-500">per night</div>
//                   </div>
//                 </div>

//                 <p className="text-gray-600 mb-6 line-clamp-2">
//                   {hotel.description}
//                 </p>

//                 <div className="flex space-x-3">
//                   <Button variant="outline" className="flex-1">
//                     View Details
//                   </Button>
//                   {isAuthenticated ? (
//                     <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
//                       Book Now
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="outline"
//                       className="flex-1"
//                       disabled
//                       title="Please sign in to book"
//                     >
//                       <Lock className="w-4 h-4 mr-2" />
//                       Sign in to Book
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {filteredHotels.length > 0 && (
//         <div className="text-center mt-8">
//           <Button variant="outline" size="lg">
//             Load More Hotels
//             <ArrowRight className="w-4 h-4 ml-2" />
//           </Button>
//         </div>
//       )}

//       {filteredHotels.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-500 text-lg">
//             No hotels found matching your criteria.
//           </div>
//           <p className="text-gray-400 mt-2">
//             Try adjusting your filters or search terms.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useGetAllHotelsByFilter } from "@/api-config/queries/hotel";
import { useState } from "react";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import { useEffect } from "react";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";

type Props = {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
};

export function HotelList({ filter, setFilter }: Props) {
  const { isAuthenticated } = useAuth();
  const [pagination, setPagination] = useState({
    page: (filter.page as number) || defaultPageNo,
    limit: (filter.limit as number) || defaultPageSize,
  });

  useEffect(() => {
    setPagination({
      page: (filter.page as number) || defaultPageNo,
      limit: (filter.limit as number) || defaultPageSize,
    });
  }, [filter.page, filter.limit]);

  const {
    data: hotelList,
    isLoading: isHotelListLoading,
    error,
  } = useGetAllHotelsByFilter({
    ...filter,
    page: pagination.page,
    limit: pagination.limit,
  });

  const handlePaginationChange = (newPagination: {
    page: number;
    limit: number;
  }) => {
    setPagination(newPagination);
    setFilter({
      ...filter,
      page: newPagination.page,
      limit: newPagination.limit,
    });
  };

  if (error) {
    return (
      <FetchErrorAlert
        title="Error"
        description="Failed to load hotel data. Please try again."
      />
    );
  }

  return (
    <>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Hotels</h2>
          <p className="text-primary">
            We found {hotelList?.data.total} hotels.
          </p>
        </div>

        <div className="space-y-6">
          {hotelList?.data.items.map((hotel) => (
            <Card
              key={hotel.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row">
                {/* Hotel Image */}
                <div className="md:w-1/3">
                  <div className="w-full h-48 md:h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      Hotel Image
                    </span>
                  </div>
                </div>

                {/* Hotel Details */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(hotel.star_rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {hotel.rating} Star Hotel
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{hotel.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        ${hotel.price}/USD
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    {isAuthenticated ? (
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
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

        {hotelList?.data.items?.length && hotelList?.data.items?.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Hotels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {hotelList?.data.items?.length === 0 && (
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
