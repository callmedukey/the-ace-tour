"use client";

import * as React from "react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { getBookingCountForRoute } from "@/actions/booking";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
interface BookingFormData {
  tripType: "One Way" | "Round Trip";
  from: string;
  to: string;
  departingDate: Date | undefined;
  returningDate: Date | undefined;
  departureTime: string;
  returnTime: string;
  passengers: number;
  pickUpaddress: string;
  dropOffaddress: string;
  customerName: string;
  customerEmail: string;
  luggage: number;
}

interface BookingFormProps {
  className?: string;
}

// Define the structure for destination prices
interface DestinationPrices {
  [destination: string]: number;
}

// Define the structure for the complete pricing map
interface PricingMap {
  [origin: string]: DestinationPrices;
}

// Pricing data structure based on the image
const PRICING_MAP: PricingMap = {
  "Convoy (H Mart)": {
    "Irvine (H Mart)": 40,
    'LAX (Terminal 3 "Shared Rides")': 59,
  },
  "Mira Mesa (H Mart)": {
    "Irvine (H Mart)": 40,
    'LAX (Terminal 3 "Shared Rides")': 59,
  },
  "Carmel Valley (Pavillions)": {
    "Irvine (H Mart)": 40,
    'LAX (Terminal 3 "Shared Rides")': 59,
  },
  "Irvine (H Mart)": {
    'LAX (Terminal 3 "Shared Rides")': 35,
  },
  'LAX (Terminal 3 "Shared Rides")': {
    "Irvine (H Mart)": 35,
    "Carmel Valley (Pavillions)": 59,
    "Mira Mesa (H Mart)": 59,
    "Convoy (H Mart)": 59,
  },
  "LA Downtown (Door to Door)": {
    "Las Vegas (Strip Hotel)": 89,
  },
  "LA Koreatown (Door to Door)": {
    "Las Vegas (Strip Hotel)": 89,
  },
  "Las Vegas (Strip Hotel)": {
    "LA Downtown (Door to Door)": 89,
    "LA Koreatown (Door to Door)": 89,
  },
};

// Note: We're using the server-side Stripe API in our checkout endpoint

export function BookingForm({ className }: BookingFormProps) {
  const t = useTranslations("BookingForm");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = React.useState(false);

  // Check for success parameter in URL on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    if (success === "true") {
      setIsPaymentSuccessful(true);
    }
  }, []);
  const [formData, setFormData] = React.useState<BookingFormData>({
    tripType: "One Way",
    from: "",
    to: "",
    departingDate: undefined,
    returningDate: undefined,
    departureTime: "5:30 AM",
    returnTime: "5:30 AM",
    passengers: 1,
    pickUpaddress: "",
    dropOffaddress: "",
    customerName: "",
    customerEmail: "",
    luggage: 1, // Default to 1 luggage per passenger
  });

  const [selectedRoute, setSelectedRoute] = React.useState("");
  const [availabilityInfo, setAvailabilityInfo] = React.useState<{
    departing?: {
      count: number;
      passengerCount: number;
      remainingSpots: number;
      maxSpots: number;
    };
    returning?: {
      count: number;
      passengerCount: number;
      remainingSpots: number;
      maxSpots: number;
    };
  }>({});

  // Add a function to check availability when date changes
  const checkAvailability = React.useCallback(async () => {
    if (!formData.from || !formData.to || !formData.departingDate) return;

    try {
      const departingResult = await getBookingCountForRoute(
        formData.from,
        formData.to,
        formData.departingDate
      );

      if (departingResult.success) {
        setAvailabilityInfo((prev) => ({
          ...prev,
          departing: {
            count: departingResult.count ?? 0,
            passengerCount: departingResult.passengerCount ?? 0,
            remainingSpots: departingResult.remainingSpots ?? 0,
            maxSpots: departingResult.maxSpots ?? 30,
          },
        }));
      }

      if (formData.tripType === "Round Trip" && formData.returningDate) {
        const returningResult = await getBookingCountForRoute(
          formData.to,
          formData.from,
          formData.returningDate
        );

        if (returningResult.success) {
          setAvailabilityInfo((prev) => ({
            ...prev,
            returning: {
              count: returningResult.count ?? 0,
              passengerCount: returningResult.passengerCount ?? 0,
              remainingSpots: returningResult.remainingSpots ?? 0,
              maxSpots: returningResult.maxSpots ?? 30,
            },
          }));
        }
      } else {
        // Clear returning info if not a round trip
        setAvailabilityInfo((prev) => ({
          ...prev,
          returning: undefined,
        }));
      }
    } catch (error) {
      console.error("Failed to check availability:", error);
    }
  }, [
    formData.from,
    formData.to,
    formData.departingDate,
    formData.returningDate,
    formData.tripType,
  ]);

  // Call checkAvailability when relevant form fields change
  React.useEffect(() => {
    checkAvailability();
  }, [
    formData.from,
    formData.to,
    formData.departingDate,
    formData.returningDate,
    checkAvailability,
  ]);

  // Calculate the current price based on selected locations
  const calculatePrice = React.useCallback(() => {
    if (!formData.from || !formData.to) return 0;

    let basePrice = 0;

    // Special case for San Diego to LAX route
    if (selectedRoute === "San Diego to LAX") {
      // Check if we have a specific price in the pricing map
      const originPrices = PRICING_MAP[formData.from];
      if (originPrices && originPrices[formData.to]) {
        // Use the price from the pricing map
        const oneWayPrice = originPrices[formData.to];
        basePrice =
          formData.tripType === "Round Trip"
            ? oneWayPrice * 2 * 0.85 // 15% discount for round trip
            : oneWayPrice;
      } else {
        // If no specific price found, use default pricing
        if (formData.to === 'LAX (Terminal 3 "Shared Rides")') {
          basePrice =
            formData.tripType === "Round Trip"
              ? 59 * 2 * 0.85 // 15% discount for round trip
              : 59;
        } else {
          // For all other destinations, use Irvine's price
          basePrice =
            formData.tripType === "Round Trip"
              ? 40 * 2 * 0.85 // 15% discount for round trip
              : 40;
        }
      }
    } else {
      // Normal pricing logic for other routes
      const originPrices = PRICING_MAP[formData.from];
      if (!originPrices) return 0;

      const oneWayPrice = originPrices[formData.to] || 0;

      if (formData.tripType === "Round Trip") {
        // For round trip, calculate return journey price
        const returnPrices = PRICING_MAP[formData.to];
        const returnPrice = returnPrices?.[formData.from] || oneWayPrice; // Use same price if return not found

        // Calculate total price with 15% discount
        const totalBeforeDiscount = oneWayPrice + returnPrice;
        basePrice = totalBeforeDiscount * 0.85;
      } else {
        basePrice = oneWayPrice;
      }
    }

    // Calculate luggage fee
    const freeLuggageAllowance = formData.passengers; // 1 free luggage per passenger
    const extraLuggage = Math.max(0, formData.luggage - freeLuggageAllowance);
    const luggageFee = extraLuggage * 15; // $15 per extra luggage

    // Multiply base price by number of passengers and add luggage fee
    return (basePrice * formData.passengers + luggageFee).toFixed(2);
  }, [
    formData.from,
    formData.to,
    formData.tripType,
    formData.passengers,
    formData.luggage,
    selectedRoute,
  ]);

  // Define location groups
  const LOCATION_GROUPS = {
    san_diego: [
      "Convoy (H Mart)",
      "Mira Mesa (H Mart)",
      "Carmel Valley (Pavillions)",
      "Irvine (H Mart)",
    ],
    lax: ['LAX (Terminal 3 "Shared Rides")'],
    la: ["LA Downtown (Door to Door)", "LA Koreatown (Door to Door)"],
    vegas: ["Las Vegas (Strip Hotel)"],
  };

  // Get filtered locations based on selected route type
  const getFilteredLocations = React.useCallback(() => {
    // If LAX to SD route is selected
    if (selectedRoute === "LAX to San Diego") {
      return ['LAX (Terminal 3 "Shared Rides")'];
    }
    // If SD-LA route is selected
    if (selectedRoute === "San Diego to LAX" || selectedRoute === "") {
      return LOCATION_GROUPS.san_diego;
    }
    // If Vegas route is selected
    if (selectedRoute === "Los Angeles to Las Vegas") {
      return LOCATION_GROUPS.la;
    }
    if (selectedRoute === "Las Vegas to Los Angeles") {
      return LOCATION_GROUPS.vegas;
    }
    // Otherwise show all locations
    return Object.keys(PRICING_MAP);
  }, [
    LOCATION_GROUPS.la,
    LOCATION_GROUPS.san_diego,
    LOCATION_GROUPS.vegas,
    selectedRoute,
  ]);

  // Get available destinations based on selected origin
  const getAvailableDestinations = React.useCallback(() => {
    if (!formData.from) return [];

    // Special handling for LAX to San Diego route
    if (selectedRoute === "LAX to San Diego") {
      // Since only LAX is available as departure, return all San Diego destinations
      return [
        "Irvine (H Mart)",
        "Carmel Valley (Pavillions)",
        "Mira Mesa (H Mart)",
        "Convoy (H Mart)",
      ];
    }

    // If it's a San Diego location
    if (LOCATION_GROUPS.san_diego.includes(formData.from)) {
      const currentIndex = LOCATION_GROUPS.san_diego.indexOf(formData.from);

      // Apply specific restrictions based on origin
      if (formData.from === "Convoy (H Mart)") {
        // For Convoy, exclude Mira Mesa and Carmel Valley
        return ["Irvine (H Mart)", ...LOCATION_GROUPS.lax];
      } else if (formData.from === "Mira Mesa (H Mart)") {
        // For Mira Mesa, exclude Carmel Valley
        return ["Irvine (H Mart)", ...LOCATION_GROUPS.lax];
      } else {
        // For other San Diego locations, show all locations that come after in the sequence
        return [
          ...LOCATION_GROUPS.san_diego.slice(currentIndex + 1),
          ...LOCATION_GROUPS.lax,
        ];
      }
    }

    // For Vegas routes
    if (LOCATION_GROUPS.la.includes(formData.from)) {
      return LOCATION_GROUPS.vegas;
    }
    if (LOCATION_GROUPS.vegas.includes(formData.from)) {
      return LOCATION_GROUPS.la;
    }

    // Return only the valid destinations from the pricing map
    const originPrices = PRICING_MAP[formData.from];
    if (!originPrices) return [];
    return Object.keys(originPrices);
  }, [
    LOCATION_GROUPS.la,
    LOCATION_GROUPS.lax,
    LOCATION_GROUPS.san_diego,
    LOCATION_GROUPS.vegas,
    formData.from,
    selectedRoute,
  ]);

  // Helper function to check if address is required
  const isAddressRequired = React.useCallback(() => {
    return (
      formData.from.includes("Door to Door") ||
      formData.to.includes("Door to Door")
    );
  }, [formData.from, formData.to]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departingDate) {
      return alert(t("missingDepartingDate"));
    }

    if (formData.tripType === "Round Trip" && !formData.returningDate) {
      return alert(t("missingReturningDate"));
    }

    console.log("🔍 [BookingForm] Starting form submission with data:", {
      ...formData,
      price: calculatePrice(),
    });

    // Validate address if required
    if (
      isAddressRequired() &&
      (!formData.pickUpaddress.trim() || !formData.dropOffaddress.trim())
    ) {
      console.warn("🚫 [BookingForm] Address validation failed");
      alert(
        "Please enter your complete pick up and drop off addresses for door-to-door service."
      );
      return;
    }

    try {
      // Check booking count for the selected route and date
      const bookingCountResult = await getBookingCountForRoute(
        formData.from,
        formData.to,
        formData.departingDate!
      );

      if (!bookingCountResult.success) {
        console.error("❌ [BookingForm] Failed to check booking count");
        alert(
          "Unable to process your booking at this time. Please try again later."
        );
        return;
      }

      // Check if adding these passengers would exceed capacity
      if ((bookingCountResult.remainingSpots ?? 0) < formData.passengers) {
        console.warn("🚫 [BookingForm] Not enough capacity for passengers");
        alert(
          `We apologize, but there are only ${bookingCountResult.remainingSpots} spots available for the selected date. Your booking requires ${formData.passengers} spots.`
        );
        return;
      }

      // If round trip, check return date booking count as well
      if (formData.tripType === "Round Trip" && formData.returningDate) {
        const returnBookingCountResult = await getBookingCountForRoute(
          formData.to,
          formData.from,
          formData.returningDate
        );

        if (!returnBookingCountResult.success) {
          console.error(
            "❌ [BookingForm] Failed to check return booking count"
          );
          alert(
            "Unable to process your booking at this time. Please try again later."
          );
          return;
        }

        // Check if adding these passengers would exceed capacity for return journey
        if (
          (returnBookingCountResult.remainingSpots ?? 0) < formData.passengers
        ) {
          console.warn(
            "🚫 [BookingForm] Not enough capacity for passengers on return journey"
          );
          alert(
            `We apologize, but there are only ${returnBookingCountResult.remainingSpots} spots available for the return date. Your booking requires ${formData.passengers} spots.`
          );
          return;
        }
      }

      // Get the current locale from the URL
      const locale = window.location.pathname.split("/")[1] || "en";
      console.log("📍 [BookingForm] Detected locale:", locale);

      // Get the current locale for the return URL path
      console.log("📍 [BookingForm] Detected locale:", locale);

      // Create Stripe Checkout Session
      console.log(
        "🔄 [BookingForm] Sending request to create checkout session..."
      );
      const response = await fetch(`/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: calculatePrice(),
          returnUrl: `/${locale}/shuttle-service`,
          // Ensure all fields are explicitly included
          luggage: formData.luggage,
          pickUpaddress: formData.pickUpaddress,
          dropOffaddress: formData.dropOffaddress,
        }),
      });

      if (!response.ok) {
        console.error("❌ [BookingForm] Checkout session creation failed:", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error("Network response was not ok");
      }

      const { url, sessionId } = await response.json();
      console.log("✅ [BookingForm] Checkout session created successfully:", {
        sessionId,
      });

      if (!url) {
        console.error("❌ [BookingForm] No checkout URL received");
        throw new Error("No checkout URL received");
      }

      console.log("➡️ [BookingForm] Redirecting to Stripe checkout:", url);
      window.location.href = url;
    } catch (error) {
      console.error("❌ [BookingForm] Error during form submission:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const inputStyles =
    "w-full sm:w-[196px] h-[40px] gap-4 border border-input px-3 py-2 rounded-md";
  const selectWrapperStyles =
    "relative after:content-[''] after:pointer-events-none after:absolute after:right-8 after:top-[50%] after:-translate-y-[50%] after:border-[4px] after:border-transparent after:border-t-[#71717A] after:mt-[2px]";

  const renderLabel = (text: string, required?: boolean) => (
    <Label className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]">
      {text}
      {required && <span className="text-[#F6B600]">*</span>}
    </Label>
  );

  // Get available departure times based on location
  const getAvailableDepartureTimes = React.useCallback(() => {
    // For LAX to San Diego route
    if (selectedRoute === "LAX to San Diego") {
      switch (formData.from) {
        case 'LAX (Terminal 3 "Shared Rides")':
          return [
            { value: "11:15 AM", label: "11:15 AM" },
            { value: "5:30 PM", label: "5:30 PM" },
          ];
        case "Irvine (H Mart)":
          return [
            { value: "12:30 PM", label: "12:30 PM" },
            { value: "7:00 PM", label: "7:00 PM" },
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "1:30 PM", label: "1:30 PM" },
            { value: "8:00 PM", label: "8:00 PM" },
          ];
        case "Mira Mesa (H Mart)":
          return [
            { value: "1:45 PM", label: "1:45 PM" },
            { value: "8:15 PM", label: "8:15 PM" },
          ];
      }
    }

    // For San Diego to LAX route
    if (selectedRoute === "San Diego to LAX") {
      switch (formData.from) {
        case "Convoy (H Mart)":
          return [
            { value: "5:30 AM", label: "5:30 AM" },
            { value: "4:30 PM", label: "4:30 PM" },
          ];
        case "Mira Mesa (H Mart)":
          return [
            { value: "5:50 AM", label: "5:50 AM" },
            { value: "4:50 PM", label: "4:50 PM" },
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "6:10 AM", label: "6:10 AM" },
            { value: "5:20 PM", label: "5:20 PM" },
          ];
        case "Irvine (H Mart)":
          return [
            { value: "7:20 AM", label: "7:20 AM" },
            { value: "6:45 PM", label: "6:45 PM" },
          ];
      }
    }

    // For Los Angeles to Las Vegas route
    if (selectedRoute === "Los Angeles to Las Vegas") {
      switch (formData.from) {
        case "LA Koreatown (Door to Door)":
          return [{ value: "11:00 AM", label: "11:00 AM" }];
        case "LA Downtown (Door to Door)":
          return [{ value: "11:15 AM", label: "11:15 AM" }];
      }
    }

    // For Las Vegas to Los Angeles route
    if (selectedRoute === "Las Vegas to Los Angeles") {
      switch (formData.from) {
        case "Las Vegas (Strip Hotel)":
          return [{ value: "7:30 PM", label: "7:30 PM" }];
      }
    }

    // Default case for other routes
    return [{ value: "5:30 AM", label: "5:30 AM" }];
  }, [formData.from, selectedRoute]);

  // Get available return times based on location
  const getAvailableReturnTimes = React.useCallback(() => {
    // For LAX to San Diego route
    if (selectedRoute === "LAX to San Diego") {
      switch (formData.from) {
        case "Mira Mesa (H Mart)":
          return [
            { value: "5:50 AM", label: "5:50 AM" },
            { value: "4:50 PM", label: "4:50 PM" },
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "6:10 AM", label: "6:10 AM" },
            { value: "5:20 PM", label: "5:20 PM" },
          ];
        case "Irvine (H Mart)":
          return [
            { value: "7:20 AM", label: "7:20 AM" },
            { value: "6:45 PM", label: "6:45 PM" },
          ];
        case 'LAX (Terminal 3 "Shared Rides")':
          return [
            { value: "8:20 AM", label: "8:20 AM" },
            { value: "8:20 PM", label: "8:20 PM" },
          ];
      }
    }

    // For San Diego to LAX route
    if (selectedRoute === "San Diego to LAX") {
      switch (formData.from) {
        case "Irvine (H Mart)":
          return [
            { value: "12:30 PM", label: "12:30 PM" },
            { value: "7:00 PM", label: "7:00 PM" },
          ];
        case "Carmel Valley (Pavillions)":
          return [
            { value: "1:30 PM", label: "1:30 PM" },
            { value: "8:00 PM", label: "8:00 PM" },
          ];
        case "Mira Mesa (H Mart)":
          return [
            { value: "1:45 PM", label: "1:45 PM" },
            { value: "8:15 PM", label: "8:15 PM" },
          ];
        case "Convoy (H Mart)":
          return [
            { value: "2:00 PM", label: "2:00 PM" },
            { value: "8:30 PM", label: "8:30 PM" },
          ];
      }
    }

    // For Los Angeles to Las Vegas route
    if (selectedRoute === "Los Angeles to Las Vegas") {
      switch (formData.from) {
        case "LA Koreatown (Door to Door)":
          return [{ value: "12:30 AM", label: "12:30 AM" }];
        case "LA Downtown (Door to Door)":
          return [{ value: "12:00 AM", label: "12:00 AM" }];
      }
    }

    // For Las Vegas to Los Angeles route
    if (selectedRoute === "Las Vegas to Los Angeles") {
      switch (formData.from) {
        case "Las Vegas (Strip Hotel)":
          return [{ value: "4:30 PM", label: "4:30 PM" }];
      }
    }

    // Default case for other routes
    return [{ value: "5:30 AM", label: "5:30 AM" }];
  }, [formData.from, selectedRoute]);

  // Define preset routes
  const PRESET_ROUTES = {
    "": { from: "", to: "" },
    "San Diego to LAX": {
      from: "Convoy (H Mart)",
      to: 'LAX (Terminal 3 "Shared Rides")',
    },
    "LAX to San Diego": {
      from: 'LAX (Terminal 3 "Shared Rides")',
      to: "Convoy (H Mart)",
    },
    "Los Angeles to Las Vegas": {
      from: "LA Downtown (Door to Door)",
      to: "Las Vegas (Strip Hotel)",
    },
    "Las Vegas to Los Angeles": {
      from: "Las Vegas (Strip Hotel)",
      to: "LA Downtown (Door to Door)",
    },
  };

  // Render success message if payment was successful
  if (isPaymentSuccessful) {
    return (
      <div className="w-full sm:w-[518px] min-h-[510px] h-fit border rounded-[20px] border-gray-200">
        <div className="h-full flex flex-col justify-center items-center px-4 sm:px-8 py-6 sm:py-9">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">
            {t("bookingSuccessTitle")}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {t("successPrimaryMessage")}
          </p>
          <p className="text-center text-gray-600 mb-2">
            {t("successSecondaryMessage")}
          </p>
          <Link
            className="mt-6 group inline-flex w-full h-[48px] items-center justify-between rounded-[8px] bg-[#1976D2] py-[8px] pl-[20px] pr-[4px] text-white transition-all hover:bg-[#1565C0]"
            href={"/support"}
          >
            <span className="text-base font-medium leading-6 tracking-[0]">
              {t("button.label")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <svg
                className="h-5 w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H6.66665M14.1666 5.83334V13.3333"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[518px] min-h-[510px] h-fit border rounded-[20px] border-gray-200">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "h-full flex flex-col justify-between px-4 sm:px-8 py-6 sm:py-9",
          className
        )}
      >
        <div className="space-y-4 mb-6">
          <RadioGroup
            defaultValue={formData.tripType}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                tripType: value as "One Way" | "Round Trip",
                returningDate:
                  value === "one-way" ? undefined : formData.returningDate, // Reset returning date if one-way
              })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="One Way" id="one-way" />
              <Label
                htmlFor="one-way"
                className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]"
              >
                {t("oneWay")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Round Trip" id="round-trip" />
              <Label
                htmlFor="round-trip"
                className="font-medium text-sm leading-5 tracking-[0%] text-[#414651]"
              >
                {t("roundTrip")}
              </Label>
            </div>
          </RadioGroup>

          <div className="grid gap-2">
            {renderLabel(t("ourRoutes"), true)}
            <div className={selectWrapperStyles}>
              <select
                value={selectedRoute}
                onChange={(e) => {
                  const route =
                    PRESET_ROUTES[e.target.value as keyof typeof PRESET_ROUTES];
                  setSelectedRoute(e.target.value);
                  setFormData({
                    ...formData,
                    from: route.from,
                    to: route.to,
                    pickUpaddress: "", // Reset addresses when changing routes
                    dropOffaddress: "",
                  });
                }}
                className={cn(
                  inputStyles,
                  "w-full sm:w-full bg-background appearance-none text-sm"
                )}
              >
                <option value="">{t("routePlaceHolder")}</option>
                <option value="San Diego to LAX">San Diego to LAX</option>
                <option value="LAX to San Diego">LAX to San Diego</option>
                <option value="Los Angeles to Las Vegas">
                  Los Angeles to Las Vegas
                </option>
                <option value="Las Vegas to Los Angeles">
                  Las Vegas to Los Angeles
                </option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel(t("from"), true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.from}
                  onChange={(e) => {
                    const newFrom = e.target.value;
                    setFormData({
                      ...formData,
                      from: newFrom,
                      to: "", // Reset destination when origin changes
                    });
                  }}
                  className={cn(
                    inputStyles,
                    "bg-background appearance-none text-sm !w-full",
                    !selectedRoute && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!selectedRoute}
                >
                  <option value="">{t("fromPlaceHolder")}</option>
                  {selectedRoute &&
                    getFilteredLocations().map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              {renderLabel(t("to"), true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  className={cn(
                    inputStyles,
                    "bg-background appearance-none text-sm !w-full",
                    !formData.from && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!formData.from}
                >
                  <option value="">{t("toPlaceHolder")}</option>
                  {formData.from &&
                    getAvailableDestinations().map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          {/* Customer Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel(t("name"), true)}
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                placeholder={t("namePlaceHolder")}
                className={cn(
                  inputStyles,
                  "w-full sm:w-full placeholder:text-sm"
                )}
                required
              />
            </div>
            <div className="grid gap-2">
              {renderLabel(t("email"), true)}
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerEmail: e.target.value,
                  })
                }
                placeholder={t("emailPlaceHolder")}
                className={cn(
                  inputStyles,
                  "w-full sm:w-full placeholder:text-sm"
                )}
                required
              />
            </div>
          </div>

          {/* Address fields */}
          {(isAddressRequired() ||
            selectedRoute === "Los Angeles to Las Vegas" ||
            selectedRoute === "Las Vegas to Los Angeles") && (
            <>
              <div className="grid gap-2">
                {renderLabel(
                  selectedRoute === "Los Angeles to Las Vegas"
                    ? t("pickUpAddress")
                    : t("pickUpAddress1"),
                  true
                )}
                <input
                  type="text"
                  value={formData.pickUpaddress}
                  onChange={(e) =>
                    setFormData({ ...formData, pickUpaddress: e.target.value })
                  }
                  placeholder="Enter your complete pick up address"
                  className={cn(inputStyles, "w-full sm:w-full")}
                  required
                />
              </div>

              <div className="grid gap-2">
                {renderLabel(
                  selectedRoute === "Los Angeles to Las Vegas"
                    ? t("dropOffAddress")
                    : t("dropOffAddress1"),
                  true
                )}
                <input
                  type="text"
                  value={formData.dropOffaddress}
                  onChange={(e) =>
                    setFormData({ ...formData, dropOffaddress: e.target.value })
                  }
                  placeholder="Enter your complete drop off address"
                  className={cn(inputStyles, "w-full sm:w-full")}
                  required
                />
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel(t("departingDate"), true)}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      inputStyles,
                      "justify-start text-left font-normal",
                      !formData.departingDate && "text-muted-foreground",
                      (!formData.from || !formData.to) &&
                        "cursor-not-allowed opacity-50"
                    )}
                    disabled={!formData.from || !formData.to}
                  >
                    {formData.departingDate ? (
                      format(formData.departingDate, "PPP")
                    ) : (
                      <span>{t("departingDatePlaceHolder")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.departingDate}
                    onSelect={(date) =>
                      setFormData({ ...formData, departingDate: date })
                    }
                    initialFocus
                    disabled={!formData.from || !formData.to}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {formData.tripType == "Round Trip" && (
              <div className="grid gap-2">
                {renderLabel(t("returningDate"), true)}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        inputStyles,
                        "justify-start text-left font-normal",
                        !formData.returningDate &&
                          "text-muted-foreground cursor-not-allowed opacity-50"
                      )}
                      disabled={!formData.departingDate}
                    >
                      {formData.returningDate ? (
                        format(formData.returningDate, "PPP")
                      ) : (
                        <span>{t("returningDatePlaceHolder")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.returningDate}
                      onSelect={(date) =>
                        setFormData({ ...formData, returningDate: date })
                      }
                      initialFocus
                      disabled={!formData.departingDate}
                      fromDate={formData.departingDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel(t("departurePickUpTime"), true)}
              <div className={selectWrapperStyles}>
                <select
                  value={formData.departureTime}
                  onChange={(e) =>
                    setFormData({ ...formData, departureTime: e.target.value })
                  }
                  className={cn(
                    inputStyles,
                    "bg-background appearance-none text-sm",
                    !formData.departingDate && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!formData.departingDate}
                >
                  {getAvailableDepartureTimes().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {formData.tripType == "Round Trip" && (
              <div className="grid gap-2">
                {renderLabel(t("returnPickUpTime"), true)}
                <div className={selectWrapperStyles}>
                  <select
                    value={formData.returnTime}
                    onChange={(e) =>
                      setFormData({ ...formData, returnTime: e.target.value })
                    }
                    className={cn(
                      inputStyles,
                      "bg-background appearance-none text-sm"
                    )}
                    disabled={!formData.returningDate}
                  >
                    {getAvailableReturnTimes().map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              {renderLabel(t("passengers"))}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-9 h-9 text-base p-2 px-1 rounded-md border"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      passengers: Math.max(1, formData.passengers - 1),
                    })
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{formData.passengers}</span>
                <Button
                  type="button"
                  variant="outline"
                  className="w-9 h-9 text-base p-2 px-1 rounded-md border"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      passengers: Math.min(10, formData.passengers + 1),
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              {renderLabel(t("luggage"))}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-9 h-9 text-base p-2 px-1 rounded-md border"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      luggage: Math.max(0, formData.luggage - 1),
                    })
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{formData.luggage}</span>
                <Button
                  type="button"
                  variant="outline"
                  className="w-9 h-9 text-base p-2 px-1 rounded-md border"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      luggage: formData.luggage + 1,
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          <div className=" text-sm text-gray-600">
            <p>{t("luggageInfo.one")}</p>
            <p>{t("luggageInfo.two")}</p>
            <p>{t("luggageInfo.three")}</p>
            {formData.luggage > formData.passengers && (
              <p className="text-amber-600 font-medium">
                {t("extraLuggageFee")}: $
                {(formData.luggage - formData.passengers) * 15} USD
              </p>
            )}
          </div>
          <div className="flex items-end">
            <span className="text-lg font-semibold">
              {t("price")}: {calculatePrice()} USD
            </span>
          </div>

          {/* Luggage Selection */}
        </div>

        {/* Add availability display after the dates section */}
        {(availabilityInfo.departing || availabilityInfo.returning) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Route Availability:</h3>
            {availabilityInfo.departing && (
              <div className="mb-2">
                <p className="text-sm">
                  Departing: {availabilityInfo.departing.remainingSpots} spots
                  available
                  <span className="text-gray-500 ml-2">
                    ({availabilityInfo.departing.passengerCount}/
                    {availabilityInfo.departing.maxSpots} passengers booked
                    across {availabilityInfo.departing.count} bookings)
                  </span>
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      availabilityInfo.departing.remainingSpots <= 5
                        ? "bg-red-500"
                        : availabilityInfo.departing.remainingSpots <= 10
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                    style={{
                      width: `${
                        (availabilityInfo.departing.count /
                          availabilityInfo.departing.maxSpots) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
            {availabilityInfo.returning && (
              <div>
                <p className="text-sm">
                  Returning: {availabilityInfo.returning.remainingSpots} spots
                  available
                  <span className="text-gray-500 ml-2">
                    ({availabilityInfo.returning.passengerCount}/
                    {availabilityInfo.returning.maxSpots} passengers booked
                    across {availabilityInfo.returning.count} bookings)
                  </span>
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      availabilityInfo.returning.remainingSpots <= 5
                        ? "bg-red-500"
                        : availabilityInfo.returning.remainingSpots <= 10
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                    style={{
                      width: `${
                        (availabilityInfo.returning.count /
                          availabilityInfo.returning.maxSpots) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="group inline-flex w-full h-[48px] items-center justify-between rounded-[8px] bg-[#1976D2] py-[8px] pl-[20px] pr-[4px] text-white transition-all hover:bg-[#1565C0]"
        >
          <span className="text-base font-medium leading-6 tracking-[0]">
            {t("button.bookNow")}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg
              className="h-5 w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H6.66665M14.1666 5.83334V13.3333"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Button>
      </form>
    </div>
  );
}
