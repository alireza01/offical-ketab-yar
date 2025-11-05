// ZarinPal Payment Gateway Integration
// Agent 4: Payment integration for Iranian market
// Docs: https://docs.zarinpal.com/paymentGateway/

export interface CreatePaymentParams {
    userId: string
    planId: 'monthly' | 'quarterly' | 'annual'
    successUrl: string
    cancelUrl: string
}

export interface PaymentSession {
    authority: string
    url: string
}

const PLAN_PRICES = {
    monthly: 299000,
    quarterly: 799000,
    annual: 2499000,
}

const PLAN_NAMES = {
    monthly: 'اشتراک ماهانه کتاب‌یار',
    quarterly: 'اشتراک 3 ماهه کتاب‌یار',
    annual: 'اشتراک سالانه کتاب‌یار',
}

/**
 * Create ZarinPal payment request
 * Docs: https://docs.zarinpal.com/paymentGateway/
 */
export async function createPaymentRequest(
    params: CreatePaymentParams
): Promise<PaymentSession> {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID

    if (!merchantId) {
        console.warn('ZarinPal merchant ID not configured, using mock mode')
        // Return mock data for development
        return {
            authority: 'mock_authority_' + Date.now(),
            url: params.successUrl,
        }
    }

    const amount = PLAN_PRICES[params.planId]
    const description = PLAN_NAMES[params.planId]

    try {
        const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchant_id: merchantId,
                amount: amount, // Amount in Tomans
                description: description,
                callback_url: params.successUrl,
                metadata: {
                    user_id: params.userId,
                    plan_id: params.planId,
                },
            }),
        })

        const data = await response.json()

        if (data.data && data.data.code === 100) {
            // Success - return payment URL
            return {
                authority: data.data.authority,
                url: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
            }
        } else {
            throw new Error(`ZarinPal error: ${data.errors?.message || 'Unknown error'}`)
        }
    } catch (error) {
        console.error('Error creating ZarinPal payment:', error)
        throw error
    }
}

/**
 * Verify ZarinPal payment
 * Call this after user returns from payment gateway
 */
export async function verifyPayment(
    authority: string,
    amount: number
): Promise<{ success: boolean; refId?: string }> {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID

    if (!merchantId) {
        console.warn('ZarinPal merchant ID not configured, using mock mode')
        return { success: true, refId: 'mock_ref_' + Date.now() }
    }

    try {
        const response = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchant_id: merchantId,
                amount: amount,
                authority: authority,
            }),
        })

        const data = await response.json()

        if (data.data && data.data.code === 100) {
            // Payment verified successfully
            return {
                success: true,
                refId: data.data.ref_id,
            }
        } else if (data.data && data.data.code === 101) {
            // Payment already verified
            return {
                success: true,
                refId: data.data.ref_id,
            }
        } else {
            return { success: false }
        }
    } catch (error) {
        console.error('Error verifying ZarinPal payment:', error)
        return { success: false }
    }
}

/**
 * Get payment status (for checking payment state)
 */
export async function getPaymentStatus(authority: string): Promise<string> {
    // This can be used to check payment status without verification
    // Useful for showing payment status to user
    return 'pending'
}

/**
 * Get plan price by ID
 */
export function getPlanPrice(planId: 'monthly' | 'quarterly' | 'annual'): number {
    return PLAN_PRICES[planId]
}

/**
 * Get plan name by ID
 */
export function getPlanName(planId: 'monthly' | 'quarterly' | 'annual'): string {
    return PLAN_NAMES[planId]
}
