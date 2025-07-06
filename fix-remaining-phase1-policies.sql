-- Fix remaining Phase 1 policies

-- 1. Fix user_preferences admin policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_preferences' 
        AND policyname = 'Admins view all preferences'
    ) THEN
        CREATE POLICY "Admins view all preferences" ON user_preferences
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- 2. Fix user_achievements admin policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' 
        AND policyname = 'Admins view all achievements'
    ) THEN
        CREATE POLICY "Admins view all achievements" ON user_achievements
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- 3. Fix user_payment_methods policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_payment_methods' 
        AND policyname = 'Users view own payment methods'
    ) THEN
        CREATE POLICY "Users view own payment methods" ON user_payment_methods
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_payment_methods' 
        AND policyname = 'Service role manages payment methods'
    ) THEN
        CREATE POLICY "Service role manages payment methods" ON user_payment_methods
            FOR ALL USING (auth.jwt()->>'role' = 'service_role');
    END IF;
END $$;