import React from "react";

const DeliveryAddress = ({ address }) => {
    if (!address) {
        return (
            <div className="bg-white rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-900">Delivery Information</h4>
                <p className="text-gray-500 mt-2">No address provided.</p>
            </div>
        );
    }

    const {
        deliveryMethod,
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
        deliveryAddress,
        boatName,
        boatLocation,
        boatContact,
        packageName,
        packageContact,
        islandCode,
        atollName,
        islandName,
    } = address;

    return (
        <div className="bg-white rounded-xl p-6 space-y-8">

            {/* Main Heading */}
            <h4 className="text-2xl font-bold text-gray-900">Delivery Information</h4>

            {/* Customer Details */}
            <Section title="Customer Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="First Name" value={firstName} />
                    <Info label="Last Name" value={lastName} />
                    <Info label="Email" value={email} />
                    <Info label="Phone" value={phone} />
                </div>
            </Section>

            {/* Billing Details */}
            <Section title="Billing Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Street" value={street} />
                    <Info label="City" value={city} />
                    <Info label="State" value={state} />
                    <Info label="Zip Code" value={zipCode} />
                    <Info label="Country" value={country} />
                </div>
            </Section>

            {/* Additional Details */}
            <Section title="Additional Information">
                <div className="space-y-2">

                    {deliveryMethod === "Home Delivery" && (
                        <Info label="Delivery Address" value={deliveryAddress} />
                    )}

                    {deliveryMethod === "Boat Delivery" && (
                        <>
                            <Info label="Boat Name" value={boatName} />
                            <Info label="Boat Location" value={boatLocation} />
                            <Info label="Boat Contact" value={boatContact} />
                            <Info label="Package Name" value={packageName} />
                            <Info label="Package Contact" value={packageContact} />
                            <Info label="Island Code" value={islandCode} />
                            <Info label="Atoll Name" value={atollName} />
                            <Info label="Island Name" value={islandName} />
                        </>
                    )}
                </div>
            </Section>

        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="space-y-3">
        <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
        <div className="h-[1px] bg-gray-200"></div>
        {children}
    </div>
);

const Info = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-gray-900 text-sm">{value || "-"}</span>
    </div>
);

export default DeliveryAddress;
