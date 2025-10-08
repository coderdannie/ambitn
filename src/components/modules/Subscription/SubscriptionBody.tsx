"use client";
import React, { useState } from "react";
import { plans } from "../../common/constants";

const SubscriptionBody = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPlans = [
    { name: "Free Plan", price: 0 },
    { name: "Basic Plan", price: 10 },
    { name: "Premium Plan", price: 25 },
  ];

  const annualPlans = [
    { name: "Free Plan", price: 0 },
    { name: "Basic Plan", price: 100 }, // discounted example
    { name: "Premium Plan", price: 220 },
  ];
  return (
    <>
      <div className="mx-auto text-center border-[#D0D5DD] border-[1px] rounded-[10px] border-solid pt-[1.5rem] mt-[2rem]">
        <h1 className="mx-auto text-[#000000] font-bold">
          Choose your right plan!
        </h1>
        <p className="mt-[.7rem]">We’ve got a plan that’s perfect for you</p>
        <div>
          <section className="flex flex-col items-center pt-8 px-4 pb-12 bg-white">
            {/* Toggle Buttons */}
            <div className="flex mb-8 border rounded-lg overflow-hidden">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 font-medium transition-all ${
                  !isAnnual
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 font-medium transition-all ${
                  isAnnual
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annual
              </button>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
              {plans.map((plan, idx) => {
                const currentPrice = isAnnual
                  ? annualPlans[idx].price
                  : monthlyPlans[idx].price;

                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between border rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transform transition-all duration-300 p-6 cursor-pointer hover:bg-[#F7FAFC] hover:border-[#1A202C]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-3xl font-bold">
                        ${currentPrice}
                        <span className="text-base font-medium text-gray-600">
                          {isAnnual ? "/year" : "/month"}
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Perfect for individuals who need Folio for just basic
                        activities
                      </p>

                      <hr className="my-5" />

                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            className={`flex items-center gap-2 text-sm ${
                              feature.available
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {feature.available ? (
                              <span className="text-green-500">✔</span>
                            ) : (
                              <span className="text-gray-400">✖</span>
                            )}
                            {feature.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="mt-6 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-all">
                      Get Started Now
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SubscriptionBody;
