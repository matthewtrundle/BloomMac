import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

// Hardcoded list of available images in the public folder
const publicImages = [
  // Hero images
  '/images/Hero/Hero.png',
  '/images/Hero/Hero2.png',
  '/images/Hero/Hero3.png',
  '/images/Hero/Hero4.png',
  '/images/Hero/Hero7.png',
  '/images/Hero/Hero11.png',
  '/images/Hero/hero15.png',
  '/images/Hero/herooptimzed.png',
  '/images/Hero/ABoutHero.png',
  
  // Home images
  '/images/Home/Confident Women.png',
  '/images/Home/new-mom.png',
  '/images/Home/Cozy Sunlit movie room.png',
  '/images/Home/Decorative Floral Pattern.png',
  
  // Services images
  '/images/Services/New Mothers.png',
  '/images/Services/Hopeful Hands.png',
  '/images/Services/Walking through fields.png',
  '/images/Services/Empty Armchair.png',
  '/images/Services/Experienced Parents.png',
  '/images/Services/AnxietyManagement1.png',
  '/images/Services/AnxietyManagement2.png',
  '/images/Services/Symbolic Shoes.png',
  
  // Team images
  '/images/Team/Jana Rundle.jpg',
  '/images/Team/jana10.png',
  
  // Logo images
  '/images/Logo/logo.jpg',
  '/images/Logo/logo2.png',
  '/images/Logo/BLOOM-LOGO.png',
  
  // All the biff01 images (postpartum/therapy themed)
  '/images/biff01_imagine_Asian_mother_gently_holding_sleeping_newborn_s_a2e9a64a-3b93-4e97-8984-6335b0af1ff4_0.png',
  '/images/biff01_imagine_Indigenous_mother_with_baby_in_traditional_car_cfbbe563-d577-4693-bb37-2542ceb4552c_0.png',
  '/images/biff01_imagine_Latina_mother_playing_peek-a-boo_with_laughing_28d922c4-5bf4-4a8e-89ea-cc7ec50271c2_2.png',
  '/images/biff01_imagine_Latina_mother_playing_peek-a-boo_with_laughing_9f91dae6-b308-42f4-935f-8c0bb0a6d485_0.png',
  '/images/biff01_imagine_calming_therapy_office_waiting_room_comfortabl_c33149ac-a86a-43b1-bb9b-689b9e3c38b6_2.png',
  '/images/biff01_imagine_calming_therapy_office_waiting_room_comfortabl_c7ddc6f2-21ca-462c-9f36-f7e006d516f8_0.png',
  '/images/biff01_imagine_confident_single_mother_holding_baby_standing__ad4e5e33-be34-41cd-a605-7f70993b90aa_1.png',
  '/images/biff01_imagine_confident_single_mother_holding_baby_standing__ad4e5e33-be34-41cd-a605-7f70993b90aa_3.png',
  '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.png',
  '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png',
  '/images/biff01_imagine_cozy_meditation_corner_with_cushions_candles_p_e3c10fb9-0217-43f2-b042-0e649918352a_0.png',
  '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__87ea8e1d-e48f-4436-a390-728d4d6d8640_3.png',
  '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__94d6aae4-5275-4cd2-82da-84152a031c82_0.png',
  '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__b76c10ee-01e1-4a2a-8894-42d53f2a1be5_2.png',
  '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__da0354fc-70ec-4bb0-90f7-96e8eb17f2e7_0.png',
  '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__da0354fc-70ec-4bb0-90f7-96e8eb17f2e7_1.png',
  '/images/biff01_imagine_emotional_mother_hugging_child_at_daycare_entr_12484e67-eecf-4045-8dbb-f80bf669e2d0_2.png',
  '/images/biff01_imagine_emotional_mother_hugging_child_at_daycare_entr_12484e67-eecf-4045-8dbb-f80bf669e2d0_3.png',
  '/images/biff01_imagine_exhausted_but_loving_mother_with_twins_double__361be80f-fd5a-46ec-b391-6d716de77342_2.png',
  '/images/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.png',
  '/images/biff01_imagine_grandmother_helping_new_mother_with_baby_inter_d53608b2-4742-46c8-a987-6681940fb2b3_1.png',
  '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.png',
  '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_3.png',
  '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__d3bf8725-8a01-4b57-ab9e-94d5b4b74af5_3.png',
  '/images/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_5989d0b3-077e-41b2-9a3f-743bcd95513e_3.png',
  '/images/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.png',
  '/images/biff01_imagine_mother_preparing_dinner_while_helping_with_hom_3a6347d1-e77b-44b8-a50b-0692ce3ce6f8_0.png',
  '/images/biff01_imagine_mother_preparing_dinner_while_helping_with_hom_3a6347d1-e77b-44b8-a50b-0692ce3ce6f8_2.png',
  '/images/biff01_imagine_mother_relaxing_in_hammock_while_children_play_1676981f-1108-40d6-bf83-9933957198c8_2.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1142a756-4014-4606-aced-81dd4005e812_0.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_2.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__398f4fdc-0cf7-49c6-9999-2bad6ee68990_0.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__50517b23-5b36-4135-b2d1-db7a7c23ff79_1.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__72d992a9-06a2-4aaa-b638-c60672b45c5f_3.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__7deac91b-3809-41a0-bb6f-16208062f916_3.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__88b8f795-1dd3-43df-890e-8511aed40d43_2.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__ca82a7b6-001d-4c7b-b403-35ee7f2d1300_2.png',
  '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png',
  '/images/biff01_imagine_parent_and_child_connection_playful_interactio_052891a2-ca43-43be-b8ef-bc2b96e01f05_1.png',
  '/images/biff01_imagine_parent_and_child_connection_playful_interactio_b5f4a5f6-bb82-40c5-b2c8-2afa9175b6d4_0.png',
  '/images/biff01_imagine_parent_and_child_connection_playful_interactio_b5f4a5f6-bb82-40c5-b2c8-2afa9175b6d4_3.png',
  '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png',
  '/images/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_119b375a-c65c-42fa-b7c4-37a65fc892ee_1.png',
  '/images/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_a05a6c20-728d-4ccc-93f4-400a990a192e_1.png',
  '/images/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_a05a6c20-728d-4ccc-93f4-400a990a192e_2.png',
  '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png',
  '/images/biff01_imagine_winding_path_with_woman_at_different_stages_sh_1d37ab80-0719-435b-84d5-90c3bf764a37_1.png',
  '/images/biff01_imagine_winding_path_with_woman_at_different_stages_sh_1d37ab80-0719-435b-84d5-90c3bf764a37_2.png',
  '/images/biff01_imagine_woman_as_tree_with_strong_roots_and_blooming_b_478b72b2-0d65-4bda-ac1c-31bfad0e64d1_1.png',
  '/images/biff01_imagine_woman_as_tree_with_strong_roots_and_blooming_b_478b72b2-0d65-4bda-ac1c-31bfad0e64d1_3.png',
  '/images/biff01_imagine_woman_at_crossroads_between_two_paths_one_show_6996af64-c265-4cfb-9603-a2d860953213_1.png',
  '/images/biff01_imagine_woman_crying_with_relief_tissues_safe_space_em_e366ee61-942d-4a6f-986b-1f9b1636f614_3.png',
  '/images/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__4a65865f-48e8-4ce9-80fb-605bafdeff86_3.png',
  '/images/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__ee80f468-185d-4a1e-bc41-4400f6cec9b8_0.png',
  '/images/biff01_imagine_woman_embracing_younger_version_of_herself_hea_0c73435d-95f6-4abf-8c0d-f85d450da73b_2.png',
  '/images/biff01_imagine_woman_embracing_younger_version_of_herself_hea_0c73435d-95f6-4abf-8c0d-f85d450da73b_3.png',
  '/images/biff01_imagine_woman_in_bubble_bath_with_candles_wine_glass_b_d0cf1a07-ed67-4f4a-8f96-e9138d30732a_2.png',
  '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.png',
  '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png',
  '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png',
  '/images/biff01_imagine_woman_laughing_genuinely_flowers_blooming_arou_704b8215-9303-4169-9427-9a193dd4a16c_1.png',
  '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.png',
  '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png',
  '/images/biff01_imagine_woman_on_video_conference_call_baby_on_lap_pro_9fe6f7a9-06d7-473c-bfab-60a1abcf978b_3.png',
  '/images/biff01_imagine_woman_painting_or_doing_art_therapy_colorful_b_7bf34db7-0615-48ca-bab1-eff77cdb1f2f_3.png',
  '/images/biff01_imagine_woman_playing_guitar_or_piano_musical_self-exp_8c4b7118-c479-432f-b08c-82788cba9766_1.png',
  '/images/biff01_imagine_woman_reading_book_in_cozy_corner_blanket_tea__9f8f6aae-b32e-4578-9c67-128f1692a130_1.png',
  '/images/biff01_imagine_woman_sitting_peacefully_by_window_rain_outsid_9065dec9-2e4b-4529-ae40-3c7e29adfaf4_1.png',
  '/images/biff01_imagine_woman_stepping_through_doorway_from_dark_to_li_a0dd90d9-93fe-4093-bb13-8292822c7efd_1.png',
  '/images/biff01_imagine_woman_surrounded_by_swirling_soft_colors_repre_1753025f-240b-48a0-ba54-d8909143a0e3_1.png',
  '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_a8ffc397-2563-4c2c-b50e-aae5544184ef_3.png',
  '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png',
  '/images/biff01_imagine_woman_with_hands_on_chest_breathing_deeply_cal_245e5c20-8acd-42cb-bd64-442f0aa42767_2.png',
  '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png',
  '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png',
  '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png',
  '/images/biff01_imagine_young_mother_studying_while_baby_sleeps_textbo_d12d0e2f-62fb-47b7-a94d-41c71540baf5_0.png',
  '/images/biff01_imagine_young_mother_studying_while_baby_sleeps_textbo_dd1e3c54-b3dc-4365-91df-eb056f7834db_0.png',
  
  // Virtual therapy images
  '/images/virtualimages/biff01_imagine_Dallas_suburban_home_with_mother_on_video_ther_b5f37bdb-aa66-4513-9461-f1fe95a1fee3_2.png',
  '/images/virtualimages/biff01_imagine_Houston_skyline_in_background_with_woman_on_la_55fc9b17-cf2d-4f4d-a75c-eb9f0f5712c1_0.png',
  '/images/virtualimages/biff01_imagine_clean_modern_virtual_waiting_room_interface_on_154d532c-6f25-4915-ad98-bec848e971c8_2.png',
  '/images/virtualimages/biff01_imagine_cozy_evening_virtual_therapy_setup_laptop_with_bb5389eb-7793-4206-a1c0-6b220fd5d7c3_3.png',
  '/images/virtualimages/biff01_imagine_cozy_home_therapy_setup_with_comfortable_armch_38c71038-1216-42da-8660-34a82cdabf60_3.png',
  '/images/virtualimages/biff01_imagine_flat_lay_of_devices_for_virtual_therapy_laptop_44e8a1b2-105a-4cad-bdd0-79ba76746f50_3.png',
  '/images/virtualimages/biff01_imagine_modern_laptop_showing_video_call_interface_wit_023af6ea-f83c-4e62-9cc4-42a27c1b75ed_3.png',
  '/images/virtualimages/biff01_imagine_mother_with_toddler_playing_quietly_nearby_dur_ac428256-9ce4-4c19-84b3-482ba54aeb59_2.png',
  '/images/virtualimages/biff01_imagine_new_mother_holding_sleeping_baby_while_on_vide_d153b34c-b91b-4cb0-874c-14ffd7b1c30b_1.png',
  '/images/virtualimages/biff01_imagine_private_home_office_corner_perfect_for_therapy_78a12a8b-a352-4d90-bd48-07087daf27eb_3.png',
  '/images/virtualimages/biff01_imagine_professional_therapists_home_office_setup_for__0d1d995b-7421-4a0b-964a-1fb848b2cbae_1.png',
  '/images/virtualimages/biff01_imagine_professional_woman_in_her_30s_having_virtual_t_727f6da0-6bf9-4159-8fd0-61d3b530b1de_1.png',
  '/images/virtualimages/biff01_imagine_split_screen_showing_4_stages_of_virtual_thera_a68f1bab-6e65-4c75-91b8-657d3334b028_2.png',
  '/images/virtualimages/biff01_imagine_stylized_Texas_map_with_glowing_connection_poi_1b4a8309-fd19-4b40-9109-6c2e57574168_3.png',
  '/images/virtualimages/biff01_imagine_woman_having_emotional_breakthrough_during_vir_c2c94744-8cbf-4923-a7c7-c92d6015a811_2.png',
  '/images/virtualimages/biff01_imagine_woman_in_rural_Texas_setting_having_virtual_th_d4e304f0-fce5-49d3-a982-adcdb8c8b769_2.png',
  '/images/virtualimages/biff01_imagine_woman_journaling_after_virtual_therapy_session_6976ee74-24f0-487b-8af2-9e9b829d8a2c_3.png',
  '/images/virtualimages/biff01_imagine_woman_setting_up_quiet_space_for_virtual_thera_50ec7d92-9148-47f8-8030-c58ac8255b14_1.png',
  '/images/virtualimages/biff01_imagine_woman_testing_internet_connection_before_thera_2c8452ed-ce73-431d-8a24-8702cb071d15_3.png',
  
  // Blog images
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1142a756-4014-4606-aced-81dd4005e812_0.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_2.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__398f4fdc-0cf7-49c6-9999-2bad6ee68990_0.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__50517b23-5b36-4135-b2d1-db7a7c23ff79_1.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__72d992a9-06a2-4aaa-b638-c60672b45c5f_3.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__7deac91b-3809-41a0-bb6f-16208062f916_3.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__88b8f795-1dd3-43df-890e-8511aed40d43_2.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__ca82a7b6-001d-4c7b-b403-35ee7f2d1300_2.png',
  '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png',
  '/images/Blog/biff01_imagine_woman_as_tree_with_strong_roots_and_blooming_b_478b72b2-0d65-4bda-ac1c-31bfad0e64d1_1.png',
  '/images/Blog/biff01_imagine_woman_as_tree_with_strong_roots_and_blooming_b_478b72b2-0d65-4bda-ac1c-31bfad0e64d1_3.png',
  '/images/Blog/biff01_imagine_woman_at_crossroads_between_two_paths_one_show_6996af64-c265-4cfb-9603-a2d860953213_1.png',
  '/images/Blog/biff01_imagine_woman_crying_with_relief_tissues_safe_space_em_e366ee61-942d-4a6f-986b-1f9b1636f614_3.png',
  '/images/Blog/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__4a65865f-48e8-4ce9-80fb-605bafdeff86_3.png',
  '/images/Blog/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__ee80f468-185d-4a1e-bc41-4400f6cec9b8_0.png',
  '/images/Blog/biff01_imagine_woman_embracing_younger_version_of_herself_hea_0c73435d-95f6-4abf-8c0d-f85d450da73b_2.png',
  '/images/Blog/biff01_imagine_woman_embracing_younger_version_of_herself_hea_0c73435d-95f6-4abf-8c0d-f85d450da73b_3.png',
  '/images/Blog/biff01_imagine_woman_in_bubble_bath_with_candles_wine_glass_b_d0cf1a07-ed67-4f4a-8f96-e9138d30732a_2.png',
  '/images/Blog/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.png',
  '/images/Blog/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png',
  '/images/Blog/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png',
  '/images/Blog/biff01_imagine_woman_laughing_genuinely_flowers_blooming_arou_704b8215-9303-4169-9427-9a193dd4a16c_1.png',
  '/images/Blog/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.png',
  '/images/Blog/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png',
  '/images/Blog/biff01_imagine_woman_on_video_conference_call_baby_on_lap_pro_9fe6f7a9-06d7-473c-bfab-60a1abcf978b_3.png',
  '/images/Blog/biff01_imagine_woman_painting_or_doing_art_therapy_colorful_b_7bf34db7-0615-48ca-bab1-eff77cdb1f2f_3.png',
  '/images/Blog/biff01_imagine_woman_playing_guitar_or_piano_musical_self-exp_8c4b7118-c479-432f-b08c-82788cba9766_1.png',
  '/images/Blog/biff01_imagine_woman_reading_book_in_cozy_corner_blanket_tea__9f8f6aae-b32e-4578-9c67-128f1692a130_1.png',
  '/images/Blog/biff01_imagine_woman_sitting_peacefully_by_window_rain_outsid_9065dec9-2e4b-4529-ae40-3c7e29adfaf4_1.png',
  '/images/Blog/biff01_imagine_woman_stepping_through_doorway_from_dark_to_li_a0dd90d9-93fe-4093-bb13-8292822c7efd_1.png',
  '/images/Blog/biff01_imagine_woman_surrounded_by_swirling_soft_colors_repre_1753025f-240b-48a0-ba54-d8909143a0e3_1.png',
  '/images/Blog/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_a8ffc397-2563-4c2c-b50e-aae5544184ef_3.png',
  '/images/Blog/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png',
  '/images/Blog/biff01_imagine_woman_with_hands_on_chest_breathing_deeply_cal_245e5c20-8acd-42cb-bd64-442f0aa42767_2.png',
  '/images/Blog/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png',
  '/images/Blog/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png',
  '/images/Blog/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png',
  
  // Toddler-related images
  '/images/biff01_mother_and_toddler_resting_together_after_tantrum_soft_1fded242-6d18-48b4-bcb8-cd05b63ccc61_1.png',
  '/images/biff01_mother_crouched_at_toddler_eye_level_in_busy_place_sof_2ee22c15-d506-4263-be4d-658870904301_2.png',
  '/images/biff01_mother_crouched_at_toddler_eye_level_in_busy_place_sof_2ee22c15-d506-4263-be4d-658870904301_3.png',
  '/images/biff01_mother_feeding_toddler_in_high_chair_while_older_child_1b674a21-c1fe-436f-95e7-73f29386d662_2.png',
  '/images/biff01_mother_helping_resistant_toddler_get_dressed_soft_wate_eaf1179a-4344-4264-9d96-860d8be7bc3f_0.png',
  '/images/biff01_mother_helping_resistant_toddler_get_dressed_soft_wate_eaf1179a-4344-4264-9d96-860d8be7bc3f_1.png',
  '/images/biff01_mother_kneeling_beside_crying_toddler_in_grocery_store_a2a82310-2f64-4b42-9112-5a96e894fa30_0.png',
  '/images/biff01_mother_kneeling_beside_crying_toddler_in_grocery_store_a2a82310-2f64-4b42-9112-5a96e894fa30_3.png',
  '/images/biff01_mother_mediating_between_two_toddlers_over_toy_soft_wa_87f4d51d-3497-409b-9e81-b1168eec2dd7_0.png',
  '/images/biff01_mother_mediating_between_two_toddlers_over_toy_soft_wa_87f4d51d-3497-409b-9e81-b1168eec2dd7_3.png',
  '/images/biff01_mother_offering_various_snacks_to_picky_toddler_soft_w_525cfc78-ba6b-4400-a5a7-d3ec7bcc39e0_1.png',
  '/images/biff01_mother_offering_various_snacks_to_picky_toddler_soft_w_525cfc78-ba6b-4400-a5a7-d3ec7bcc39e0_2.png',
  '/images/biff01_mother_on_video_call_with_toddler_climbing_on_lap_soft_b118abf5-8f66-4124-856a-cb87cd7e1e61_1.png',
  '/images/biff01_mother_rocking_tired_crying_toddler_in_nursery_soft_wa_6d51c38b-b89d-4d21-ae4c-e3f99897cc1c_1.png',
  '/images/biff01_mother_taking_deep_breath_in_bathroom_soft_watercolor__768283a2-efe4-4eae-8f69-e39e506b4cc7_0.png',
  '/images/biff01_mother_taking_deep_breath_in_bathroom_soft_watercolor__768283a2-efe4-4eae-8f69-e39e506b4cc7_1.png',
  '/images/biff01_tired_mother_sitting_outside_toddlers_bedroom_door_sof_d146b6b9-0e21-4f9c-875b-2f40a32575bb_3.png'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch images from Supabase storage
    const { data: supabaseImages, error } = await supabaseAdmin.storage
      .from('blog-images')
      .list('', {
        limit: 1000,
        offset: 0
      });

    let allImages = [...publicImages];

    if (!error && supabaseImages) {
      // Add Supabase storage URLs
      const supabaseUrls = supabaseImages
        .filter(file => file.name && !file.name.startsWith('.'))
        .map(file => {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('blog-images')
            .getPublicUrl(file.name);
          return publicUrl;
        });
      
      allImages = [...allImages, ...supabaseUrls];
    }

    // Remove duplicates and sort
    const uniqueImages = Array.from(new Set(allImages)).sort();

    res.status(200).json({ 
      images: uniqueImages,
      count: uniqueImages.length,
      publicCount: publicImages.length,
      supabaseCount: uniqueImages.length - publicImages.length
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    
    // Fallback to just public images if there's an error
    res.status(200).json({ 
      images: publicImages,
      count: publicImages.length,
      publicCount: publicImages.length,
      supabaseCount: 0,
      error: 'Failed to fetch Supabase images, showing only public images'
    });
  }
}