
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Opportunities
CREATE TYPE public.opportunity_category AS ENUM ('courses', 'competitions', 'volunteering');
CREATE TYPE public.opportunity_format AS ENUM ('online', 'in_person', 'hybrid');

CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category public.opportunity_category NOT NULL,
  format public.opportunity_format NOT NULL DEFAULT 'online',
  tag TEXT,
  link TEXT NOT NULL,
  deadline DATE,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view opportunities" ON public.opportunities
FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert opportunities" ON public.opportunities
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update opportunities" ON public.opportunities
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete opportunities" ON public.opportunities
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER opportunities_updated_at BEFORE UPDATE ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_useful BOOLEAN NOT NULL,
  suggestion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback TO anon, authenticated;
GRANT SELECT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON public.feedback
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read feedback" ON public.feedback
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed sample opportunities
INSERT INTO public.opportunities (title, description, organizer, category, format, tag, link, deadline) VALUES
('Harvard CS50 Introduction to Computer Science', 'Free online programming course covering C, Python, SQL, and web development. Earn a certificate to boost your portfolio.', 'Harvard University (edX)', 'courses', 'online', 'Programming', 'https://cs50.harvard.edu/x/', '2026-09-01'),
('Google Africa Developer Scholarship', 'Free training in Android, Web, and Cloud development for African students. Top scorers get full Google certifications.', 'Google', 'courses', 'online', 'AI & Cloud', 'https://developers.google.com/community/gads', '2026-08-15'),
('British Council English Online Courses', 'Improve your English with interactive lessons. Great prep for IELTS and TOEFL applications to foreign universities.', 'British Council Algeria', 'courses', 'hybrid', 'English', 'https://www.britishcouncil.dz/', NULL),
('International Mathematical Olympiad (IMO)', 'The world championship mathematics competition for high school students. Algeria sends an official team yearly.', 'IMO Foundation', 'competitions', 'in_person', 'Math Olympiad', 'https://www.imo-official.org/', '2026-03-30'),
('Google Hash Code', 'Team-based programming competition organized by Google. Solve a real engineering problem in 4 hours.', 'Google', 'competitions', 'online', 'Hackathon', 'https://codingcompetitions.withgoogle.com/hashcode', '2026-02-20'),
('Maghreb AI Hackathon', 'A 48-hour AI hackathon for North African students. Build projects, network with mentors, win scholarships.', 'Maghreb AI', 'competitions', 'in_person', 'AI Hackathon', 'https://maghreb.ai/', '2026-05-10'),
('SOS Children''s Villages Algeria', 'Volunteer with vulnerable children in Algiers, Oran, and Tlemcen. Tutoring, sports, and creative workshops.', 'SOS Villages Algérie', 'volunteering', 'in_person', 'Community', 'https://www.sos-villagesdenfants.dz/', NULL),
('Red Crescent Algeria Youth Program', 'Join humanitarian missions: first aid training, blood drives, disaster relief. Recognized internationally.', 'Algerian Red Crescent', 'volunteering', 'in_person', 'Humanitarian', 'https://www.cra-dz.org/', NULL),
('United Nations Online Volunteering', 'Remote volunteering for UN agencies. Translation, research, design, and tech projects for global impact.', 'United Nations', 'volunteering', 'online', 'Global Impact', 'https://www.onlinevolunteering.org/', NULL);
