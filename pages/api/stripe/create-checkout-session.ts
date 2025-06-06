import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, COURSE_PRICES, CourseId } from '../../../lib/stripe';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { courseId, customerEmail, customerName } = req.body;

    // Validate course ID
    if (!courseId || !COURSE_PRICES[courseId as CourseId]) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = COURSE_PRICES[courseId as CourseId];

    // Create or retrieve customer
    let customer;
    if (customerEmail) {
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            source: 'bloom-psychology-course-purchase',
          },
        });
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer?.id,
      customer_email: !customer ? customerEmail : undefined,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: course.currency,
            product_data: {
              name: course.name,
              description: `Digital course: ${course.name}`,
              images: ['https://bloompsychologynorthaustin.com/images/Logo/BLOOM-LOGO.png'],
            },
            unit_amount: course.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/courses/purchase-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
      cancel_url: `${req.headers.origin}/courses/${courseId}?cancelled=true`,
      metadata: {
        courseId,
        customerEmail: customerEmail || '',
        source: 'bloom-psychology',
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
    });

    // Log the checkout session creation in Supabase
    if (customerEmail) {
      try {
        await supabase.from('course_purchases').insert({
          customer_email: customerEmail,
          customer_name: customerName,
          course_id: courseId,
          stripe_checkout_session_id: session.id,
          amount: course.amount,
          currency: course.currency,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error('Error logging to database:', dbError);
        // Don't fail the checkout if DB logging fails
      }
    }

    res.status(200).json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Error creating checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}