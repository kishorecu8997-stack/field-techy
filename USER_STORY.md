# User Story: Stripe Wallet Top-Up and Bank Onboarding

## Story
As a client or engineer using Field-Techy,
I want secure Stripe-based payment and onboarding flows,
so that I can add funds to my wallet and connect bank details reliably for payouts.

## Business Value
- Replaces mock/manual payment paths with production-ready Stripe flows.
- Improves payment trust, compliance, and operational reliability.
- Reduces support friction by guiding users through standardized onboarding.

## Scope
- Client can add wallet funds using card payment via Stripe.
- Engineer can start Stripe Connect onboarding from earnings/bank actions.
- System refreshes wallet/balance data after successful transactions.

## Acceptance Criteria
1. Client wallet top-up
- Given a client is on My Wallet,
  when they click **Add Funds**,
  then a Stripe card payment modal is shown.
- Given valid amount and card details,
  when payment succeeds,
  then success feedback is shown and wallet balance refreshes.
- Given invalid amount/card or API failure,
  when payment is attempted,
  then an actionable error message is displayed.

2. Engineer Stripe onboarding
- Given an engineer clicks **Add Bank Details** or **Edit Bank Details**,
  when onboarding is initiated,
  then the app connects Stripe account and retrieves onboarding link.
- Given onboarding link is returned,
  when flow continues,
  then user is redirected/opened to Stripe onboarding.
- Given onboarding fails,
  when user retries,
  then onboarding attempt can be restarted from UI.

3. Integration and config
- Stripe is initialized globally with `VITE_STRIPE_PUBLISHABLE_KEY`.
- Required Stripe libraries are installed and available in web app runtime.

## Non-Functional Requirements
- Payment actions should prevent duplicate submissions during processing.
- Errors should be surfaced with clear toast/UI feedback.
- Wallet and balance data should be consistent after successful operations.

## Out of Scope
- Legacy manual bank-form submission flows (currently bypassed).
- Full withdraw feature implementation in this branch.

## Risks / Follow-ups
- Remove temporary placeholder labels and debug logs before production merge.
- Validate final UX copy and navigation behavior for onboarding return/refresh URLs.
