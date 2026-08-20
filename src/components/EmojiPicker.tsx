'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Smile,
  Trees,
  Coffee,
  Home as HomeIcon,
  Sparkles,
  Search,
  X,
  Clock,
  Delete,
  Heart
} from 'lucide-react';

interface EmojiItem {
  char: string;
  name: string;
  keywords: string;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: any;
  emojis: EmojiItem[];
}

const DEFAULT_RECENTS = ['👍', '❤️', '😂', '🔥', '🙏', '🏠', '✨', '💯', '✅', '☕', '😊', '🎉'];

const EMOJI_DATABASE: EmojiCategory[] = [
  {
    id: 'people',
    name: 'Smileys & People',
    icon: Smile,
    emojis: [
      { char: '😀', name: 'grinning', keywords: 'smile happy joy grin face' },
      { char: '😃', name: 'smiley', keywords: 'smile happy joy face mouth' },
      { char: '😄', name: 'smile', keywords: 'smile happy joy laugh' },
      { char: '😁', name: 'grin', keywords: 'grin smile teeth happy' },
      { char: '😆', name: 'laughing', keywords: 'laugh haha lol satisfied' },
      { char: '😅', name: 'sweat_smile', keywords: 'sweat smile relief phew' },
      { char: '😂', name: 'joy', keywords: 'joy cry tears laugh lol haha' },
      { char: '🤣', name: 'rofl', keywords: 'rolling floor laughing lol' },
      { char: '😊', name: 'blush', keywords: 'blush smile shy proud' },
      { char: '😇', name: 'innocent', keywords: 'angel innocent halo smile' },
      { char: '🙂', name: 'slightly_smiling', keywords: 'smile slight pleasant' },
      { char: '🙃', name: 'upside_down', keywords: 'sarcasm silly goofy' },
      { char: '😉', name: 'wink', keywords: 'wink flirt playful joke' },
      { char: '😌', name: 'relieved', keywords: 'relieved calm peaceful' },
      { char: '😍', name: 'heart_eyes', keywords: 'love heart eyes crush adore' },
      { char: '🥰', name: 'smiling_hearts', keywords: 'love affection warm tender' },
      { char: '😘', name: 'kissing_heart', keywords: 'kiss love blow kiss flirt' },
      { char: '😗', name: 'kissing', keywords: 'kiss mouth pout' },
      { char: '😙', name: 'kissing_smiling_eyes', keywords: 'kiss smile happy' },
      { char: '😚', name: 'kissing_closed_eyes', keywords: 'kiss closed eyes' },
      { char: '😋', name: 'yum', keywords: 'yum delicious food tasty' },
      { char: '😛', name: 'stuck_out_tongue', keywords: 'tongue silly playful' },
      { char: '😜', name: 'stuck_out_tongue_winking_eye', keywords: 'tongue wink party crazy' },
      { char: '🤪', name: 'zany_face', keywords: 'crazy goofy wild' },
      { char: '😝', name: 'stuck_out_tongue_closed_eyes', keywords: 'tongue tease prank' },
      { char: '🤑', name: 'money_mouth', keywords: 'money rich cash dollar' },
      { char: '🤗', name: 'hugging', keywords: 'hug embrace warm welcome' },
      { char: '🤭', name: 'hand_over_mouth', keywords: 'gasp chuckle oops secret' },
      { char: '🤫', name: 'shushing', keywords: 'shh quiet silent whisper' },
      { char: '🤔', name: 'thinking', keywords: 'think ponder hmm consider' },
      { char: '🤐', name: 'zipper_mouth', keywords: 'quiet secret zip silence' },
      { char: '🤨', name: 'raised_eyebrow', keywords: 'skeptical doubt suspicious' },
      { char: '😐', name: 'neutral_face', keywords: 'neutral meh whatever' },
      { char: '😑', name: 'expressionless', keywords: 'blank stare deadpan' },
      { char: '😶', name: 'no_mouth', keywords: 'speechless mute quiet' },
      { char: '😏', name: 'smirk', keywords: 'smirk flirt sly cheeky' },
      { char: '😒', name: 'unamused', keywords: 'bored annoyed unhappy' },
      { char: '🙄', name: 'rolling_eyes', keywords: 'eyeroll whatever duh' },
      { char: '😬', name: 'grimacing', keywords: 'grimace awkward cringe oops' },
      { char: '🤥', name: 'lying_face', keywords: 'liar pinocchio' },
      { char: '😔', name: 'pensive', keywords: 'sad depressed pensive' },
      { char: '😪', name: 'sleepy', keywords: 'tired sleep rest' },
      { char: '🤤', name: 'drooling', keywords: 'drool hungry crave' },
      { char: '😴', name: 'sleeping', keywords: 'sleep zzz bedtime' },
      { char: '😷', name: 'mask', keywords: 'mask sick health covid' },
      { char: '🤒', name: 'thermometer', keywords: 'fever sick illness' },
      { char: '🤕', name: 'head_bandage', keywords: 'hurt injured pain' },
      { char: '🤢', name: 'nauseated', keywords: 'gross sick throw up' },
      { char: '🤮', name: 'vomiting', keywords: 'barf vomit puke' },
      { char: '🤧', name: 'sneezing', keywords: 'sneeze cold allergy' },
      { char: '🥵', name: 'hot_face', keywords: 'heat warm sweat summer' },
      { char: '🥶', name: 'cold_face', keywords: 'freeze winter cold ice' },
      { char: '🥴', name: 'woozy', keywords: 'dizzy drunk wasted' },
      { char: '😵', name: 'dizzy_face', keywords: 'dizzy knocked out ko' },
      { char: '🤯', name: 'exploding_head', keywords: 'mind blown shocked crazy' },
      { char: '🤠', name: 'cowboy', keywords: 'cowboy hat yeehaw' },
      { char: '🥳', name: 'partying_face', keywords: 'party celebrate happy bday' },
      { char: '😎', name: 'sunglasses', keywords: 'cool shades sunglasses boss' },
      { char: '🤓', name: 'nerd', keywords: 'nerd smart geek glasses' },
      { char: '🧐', name: 'monocle', keywords: 'detective examine curious' },
      { char: '😕', name: 'confused', keywords: 'confused puzzled lost' },
      { char: '😟', name: 'worried', keywords: 'worried nervous anxious' },
      { char: '🙁', name: 'slightly_frowning', keywords: 'frown sad unhappy' },
      { char: '😮', name: 'open_mouth', keywords: 'surprise wow shock' },
      { char: '😯', name: 'hushed', keywords: 'hushed silent gasp' },
      { char: '😲', name: 'astonished', keywords: 'shocked amazed jaw drop' },
      { char: '😳', name: 'flushed', keywords: 'flushed embarrassed blush' },
      { char: '🥺', name: 'pleading', keywords: 'beg please puppy eyes' },
      { char: '😦', name: 'frowning_open', keywords: 'frown open upset' },
      { char: '😧', name: 'anguished', keywords: 'pain agony upset' },
      { char: '😨', name: 'fearful', keywords: 'fear scared spooked' },
      { char: '😰', name: 'cold_sweat', keywords: 'nervous panic stress' },
      { char: '😥', name: 'disappointed_relieved', keywords: 'whew close phew' },
      { char: '😢', name: 'cry', keywords: 'tear sad weep cry' },
      { char: '😭', name: 'sob', keywords: 'sob crying tears upset' },
      { char: '😱', name: 'scream', keywords: 'scream terror horror panic' },
      { char: '😖', name: 'confounded', keywords: 'frustrated annoyed' },
      { char: '😣', name: 'persevere', keywords: 'struggle hold on' },
      { char: '😞', name: 'disappointed', keywords: 'letdown sad down' },
      { char: '😓', name: 'sweat', keywords: 'hard work sweat sigh' },
      { char: '😩', name: 'weary', keywords: 'tired worn out exhausted' },
      { char: '😫', name: 'tired_face', keywords: 'exhausted over it' },
      { char: '🥱', name: 'yawning', keywords: 'yawn boring sleepy' },
      { char: '😤', name: 'triumph', keywords: 'steam proud huff win' },
      { char: '😡', name: 'rage', keywords: 'mad angry furious rage' },
      { char: '😠', name: 'angry', keywords: 'mad upset annoyed' },
      { char: '🤬', name: 'cursing', keywords: 'swear cuss angry furious' },
      { char: '😈', name: 'smiling_imp', keywords: 'devil naughty horns evil' },
      { char: '👿', name: 'imp', keywords: 'devil angry evil' },
      { char: '💀', name: 'skull', keywords: 'dead death dead skeleton lol' },
      { char: '💩', name: 'poop', keywords: 'poo shit poop crap' },
      { char: '🤡', name: 'clown', keywords: 'clown fool circus' },
      { char: '👻', name: 'ghost', keywords: 'ghost boo spooky halloween' },
      { char: '👽', name: 'alien', keywords: 'alien space ufo' },
      { char: '🤖', name: 'robot', keywords: 'robot bot tech ai' },
      // Hands & Gestures
      { char: '👋', name: 'wave', keywords: 'wave hello goodbye hi bye' },
      { char: '🤚', name: 'raised_back_of_hand', keywords: 'hand stop back' },
      { char: '✋', name: 'raised_hand', keywords: 'high five stop hand' },
      { char: '🖖', name: 'vulcan', keywords: 'spock peace star trek' },
      { char: '👌', name: 'ok_hand', keywords: 'ok okay perfect agree yes' },
      { char: '🤌', name: 'pinched_fingers', keywords: 'italian what you want' },
      { char: '🤏', name: 'pinching_hand', keywords: 'small little bit tiny' },
      { char: '✌️', name: 'v', keywords: 'peace victory two v' },
      { char: '🤞', name: 'crossed_fingers', keywords: 'luck hope wish fingers' },
      { char: '🫰', name: 'hand_with_index_and_thumb_crossed', keywords: 'kpop heart money love' },
      { char: '🤟', name: 'love_you_gesture', keywords: 'ily love rock' },
      { char: '🤘', name: 'metal', keywords: 'rock on metal horns' },
      { char: '🤙', name: 'call_me', keywords: 'shaka surf call phone' },
      { char: '👈', name: 'point_left', keywords: 'point left finger' },
      { char: '👉', name: 'point_right', keywords: 'point right finger' },
      { char: '👆', name: 'point_up', keywords: 'point up above look' },
      { char: '👇', name: 'point_down', keywords: 'point down below look' },
      { char: '☝️', name: 'point_up_2', keywords: 'one point attention first' },
      { char: '👍', name: 'thumbsup', keywords: 'thumbs up like good yes agree +1' },
      { char: '👎', name: 'thumbsdown', keywords: 'thumbs down dislike bad no -1' },
      { char: '✊', name: 'fist', keywords: 'power punch strength' },
      { char: '👊', name: 'punch', keywords: 'fist bump bro fist punch' },
      { char: '🤛', name: 'left_facing_fist', keywords: 'fist bump bro' },
      { char: '🤜', name: 'right_facing_fist', keywords: 'fist bump bro' },
      { char: '👏', name: 'clap', keywords: 'applause bravo praise cheer' },
      { char: '🙌', name: 'raised_hands', keywords: 'hooray celebrate praise yay' },
      { char: '👐', name: 'open_hands', keywords: 'open hands welcome hug' },
      { char: '🤲', name: 'palms_up', keywords: 'prayer hold cupped' },
      { char: '🤝', name: 'handshake', keywords: 'deal agreement handshake meet' },
      { char: '🙏', name: 'pray', keywords: 'pray please thank you namaste thanks' },
      { char: '✍️', name: 'writing_hand', keywords: 'write note pen signing' },
      { char: '💅', name: 'nail_care', keywords: 'nails salon manicure sassy' },
      { char: '🤳', name: 'selfie', keywords: 'selfie phone camera photo' },
      { char: '💪', name: 'muscle', keywords: 'flex strong bicep fitness workout' },
      { char: '👀', name: 'eyes', keywords: 'look see watch look curious' },
      { char: '🗣️', name: 'speaking_head', keywords: 'talk speak voice chat' }
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Animals',
    icon: Trees,
    emojis: [
      { char: '🐶', name: 'dog', keywords: 'puppy dog pet bark woof' },
      { char: '🐱', name: 'cat', keywords: 'kitten cat pet meow kitty' },
      { char: '🐭', name: 'mouse', keywords: 'mouse rodent squeak' },
      { char: '🐹', name: 'hamster', keywords: 'hamster pet cute' },
      { char: '🐰', name: 'rabbit', keywords: 'bunny rabbit pet jump' },
      { char: '🦊', name: 'fox', keywords: 'fox clever wild' },
      { char: '🐻', name: 'bear', keywords: 'bear grizzly teddy' },
      { char: '🐼', name: 'panda', keywords: 'panda bear cute bamboo' },
      { char: '🐨', name: 'koala', keywords: 'koala australia eucalyptus' },
      { char: '🐯', name: 'tiger', keywords: 'tiger roar cat strip' },
      { char: '🦁', name: 'lion', keywords: 'lion king roar pride' },
      { char: '🐮', name: 'cow', keywords: 'cow moo milk farm' },
      { char: '🐷', name: 'pig', keywords: 'pig oink snout farm' },
      { char: '🐸', name: 'frog', keywords: 'frog toad ribbit pond' },
      { char: '🐵', name: 'monkey_face', keywords: 'monkey chimp banana' },
      { char: '🙈', name: 'see_no_evil', keywords: 'see no evil monkey shy' },
      { char: '🙉', name: 'hear_no_evil', keywords: 'hear no evil monkey' },
      { char: '🙊', name: 'speak_no_evil', keywords: 'speak no evil oops secret' },
      { char: '🐦', name: 'bird', keywords: 'bird tweet fly chirp' },
      { char: '🐤', name: 'baby_chick', keywords: 'chick bird cute yellow' },
      { char: '🦆', name: 'duck', keywords: 'duck quack pond' },
      { char: '🦅', name: 'eagle', keywords: 'eagle bird soar predator' },
      { char: '🦉', name: 'owl', keywords: 'owl wise night hoot' },
      { char: '🐺', name: 'wolf', keywords: 'wolf howl wild pack' },
      { char: '🐴', name: 'horse', keywords: 'horse pony ride gallop' },
      { char: '🦄', name: 'unicorn', keywords: 'unicorn magic rainbow horn' },
      { char: '🐝', name: 'honeybee', keywords: 'bee honey buzz sting' },
      { char: '🐛', name: 'bug', keywords: 'caterpillar worm bug' },
      { char: '🦋', name: 'butterfly', keywords: 'butterfly beauty wings' },
      { char: '🐌', name: 'snail', keywords: 'snail slow shell' },
      { char: '🐢', name: 'turtle', keywords: 'turtle tortoise slow reptile' },
      { char: '🐍', name: 'snake', keywords: 'snake serpent hiss reptile' },
      { char: '🐙', name: 'octopus', keywords: 'octopus tentacles sea' },
      { char: '🐠', name: 'tropical_fish', keywords: 'fish ocean aquarium' },
      { char: '🐟', name: 'fish', keywords: 'fish seafood swimming' },
      { char: '🐬', name: 'dolphin', keywords: 'dolphin ocean smart' },
      { char: '🐳', name: 'whale', keywords: 'whale ocean spout big' },
      { char: '🦈', name: 'shark', keywords: 'shark ocean teeth predator' },
      { char: '🐾', name: 'paw_prints', keywords: 'paws pet tracks dog cat' },
      { char: '💐', name: 'bouquet', keywords: 'flowers bouquet gift love' },
      { char: '🌸', name: 'cherry_blossom', keywords: 'sakura flower blossom pink' },
      { char: '🌹', name: 'rose', keywords: 'rose red flower love romantic' },
      { char: '🌺', name: 'hibiscus', keywords: 'hibiscus tropical flower' },
      { char: '🌻', name: 'sunflower', keywords: 'sunflower summer yellow seed' },
      { char: '🌼', name: 'blossom', keywords: 'flower daisy yellow bloom' },
      { char: '🌷', name: 'tulip', keywords: 'tulip flower spring holland' },
      { char: '🌱', name: 'seedling', keywords: 'seedling sprout grow plant green' },
      { char: '🌲', name: 'evergreen_tree', keywords: 'tree pine evergreen forest' },
      { char: '🌳', name: 'deciduous_tree', keywords: 'tree park green oak' },
      { char: '🌴', name: 'palm_tree', keywords: 'palm beach tropical island' },
      { char: '🌵', name: 'cactus', keywords: 'cactus desert plant prick' },
      { char: '🌿', name: 'herb', keywords: 'herb leaves green plant fresh' },
      { char: '🍀', name: 'four_leaf_clover', keywords: 'lucky clover fortune 4 leaf' },
      { char: '🍁', name: 'maple_leaf', keywords: 'maple autumn fall canada' },
      { char: '🍂', name: 'fallen_leaf', keywords: 'autumn fall leaves brown' },
      { char: '🍃', name: 'leaves', keywords: 'leaves wind blow green flutter' },
      { char: '🍄', name: 'mushroom', keywords: 'mushroom fungus toadstool' },
      { char: '☀️', name: 'sunny', keywords: 'sun sunny bright warm weather' },
      { char: '⛅', name: 'partly_sunny', keywords: 'clouds sun weather' },
      { char: '☁️', name: 'cloud', keywords: 'cloud weather overcast sky' },
      { char: '🌧️', name: 'rain_cloud', keywords: 'rain shower wet weather' },
      { char: '⚡', name: 'zap', keywords: 'lightning electricity power zap' },
      { char: '❄️', name: 'snowflake', keywords: 'snow cold winter frost ice' },
      { char: '🔥', name: 'fire', keywords: 'fire flame hot lit viral blaze' },
      { char: '💧', name: 'droplet', keywords: 'water drop sweat leak tear' },
      { char: '🌊', name: 'ocean', keywords: 'wave sea beach surf ocean' },
      { char: '🌈', name: 'rainbow', keywords: 'rainbow colors bright sky' }
    ]
  },
  {
    id: 'objects',
    name: 'Food & Objects',
    icon: Coffee,
    emojis: [
      { char: '☕', name: 'coffee', keywords: 'coffee tea cafe morning drink hot' },
      { char: '🍵', name: 'tea', keywords: 'green tea matcha hot drink' },
      { char: '🧋', name: 'boba', keywords: 'boba bubble tea milk drink' },
      { char: '🍺', name: 'beer', keywords: 'beer pub cheers pint alcohol' },
      { char: '🍻', name: 'beers', keywords: 'beers cheers toast celebrate' },
      { char: '🍷', name: 'wine_glass', keywords: 'wine red glass romantic drink' },
      { char: '🍸', name: 'cocktail', keywords: 'cocktail martini bar party' },
      { char: '🍕', name: 'pizza', keywords: 'pizza cheese slice italian fastfood' },
      { char: '🍔', name: 'hamburger', keywords: 'burger fast food beef bun' },
      { char: '🍟', name: 'fries', keywords: 'french fries potato snack' },
      { char: '🥪', name: 'sandwich', keywords: 'sandwich lunch bread sub' },
      { char: '🍜', name: 'ramen', keywords: 'ramen noodles soup bowl' },
      { char: '🍝', name: 'spaghetti', keywords: 'pasta spaghetti italian noodles' },
      { char: '🍛', name: 'curry', keywords: 'curry rice indian food spicy' },
      { char: '🍚', name: 'rice', keywords: 'rice bowl food asian' },
      { char: '🥗', name: 'green_salad', keywords: 'salad healthy diet veg fresh' },
      { char: '🍿', name: 'popcorn', keywords: 'popcorn movie snack cinema' },
      { char: '🍳', name: 'egg', keywords: 'egg fry breakfast cooking' },
      { char: '🍞', name: 'bread', keywords: 'bread loaf toast bakery' },
      { char: '🍎', name: 'apple', keywords: 'red apple fruit healthy' },
      { char: '🍌', name: 'banana', keywords: 'banana fruit yellow monkey' },
      { char: '🍉', name: 'watermelon', keywords: 'watermelon summer fruit juicy' },
      { char: '🍓', name: 'strawberry', keywords: 'strawberry berry red sweet' },
      { char: '🥭', name: 'mango', keywords: 'mango tropical fruit sweet king' },
      { char: '🎂', name: 'birthday', keywords: 'cake birthday celebration candles party' },
      { char: '🍰', name: 'cake', keywords: 'shortcake dessert sweet slice' },
      { char: '🍫', name: 'chocolate_bar', keywords: 'chocolate candy sweet cocoa' },
      // Devices & Everyday Tools
      { char: '💻', name: 'computer', keywords: 'laptop pc mac tech work code' },
      { char: '📱', name: 'iphone', keywords: 'phone mobile smartphone cell call' },
      { char: '📺', name: 'tv', keywords: 'television show screen netflix' },
      { char: '📷', name: 'camera', keywords: 'camera photo picture snapshot' },
      { char: '🎧', name: 'headphones', keywords: 'headphones music audio podcast' },
      { char: '🎮', name: 'video_game', keywords: 'game controller ps5 xbox play' },
      { char: '💡', name: 'bulb', keywords: 'light bulb idea bright electricity' },
      { char: '⏰', name: 'alarm_clock', keywords: 'alarm clock time morning wake up' },
      { char: '🔑', name: 'key', keywords: 'key unlock flat room door home password' },
      { char: '🔒', name: 'lock', keywords: 'lock security private closed safe' },
      { char: '🔓', name: 'unlock', keywords: 'unlock open security access' },
      { char: '📦', name: 'package', keywords: 'box delivery parcel amazon moving' },
      { char: '🎁', name: 'gift', keywords: 'present gift box birthday surprise' },
      { char: '🎉', name: 'tada', keywords: 'party popper celebrate congrats tada' },
      { char: '🏆', name: 'trophy', keywords: 'trophy win champion award prize 1st' },
      { char: '🥇', name: 'first_place', keywords: 'gold medal 1st place champion' },
      { char: '⚽', name: 'soccer', keywords: 'football soccer ball match game' },
      { char: '🏏', name: 'cricket', keywords: 'cricket bat ball match sport india' },
      { char: '🏋️', name: 'weightlifter', keywords: 'gym workout fitness weights' },
      { char: '🚗', name: 'car', keywords: 'car automobile drive ride vehicle' },
      { char: '🛵', name: 'scooter', keywords: 'motor scooter bike scooty delivery' },
      { char: '🚲', name: 'bike', keywords: 'bicycle cycle ride exercise' }
    ]
  },
  {
    id: 'places',
    name: 'Flat & Places',
    icon: HomeIcon,
    emojis: [
      { char: '🏠', name: 'house', keywords: 'home house flat residence apartment living' },
      { char: '🏡', name: 'house_with_garden', keywords: 'house garden villa yard home' },
      { char: '🏢', name: 'office', keywords: 'building apartment office skyscraper work' },
      { char: '🏨', name: 'hotel', keywords: 'hotel resort stay room accommodation' },
      { char: '🏫', name: 'school', keywords: 'school college campus university study' },
      { char: '🏙️', name: 'cityscape', keywords: 'city skyline buildings downtown' },
      { char: '🛏️', name: 'bed', keywords: 'bed bedroom mattress sleep room furniture' },
      { char: '🛋️', name: 'couch_and_lamp', keywords: 'couch sofa living room furniture lamp' },
      { char: '🚪', name: 'door', keywords: 'door room enter exit entrance home' },
      { char: '🪑', name: 'chair', keywords: 'chair seat desk sit furniture' },
      { char: '🚽', name: 'toilet', keywords: 'toilet bathroom washroom loo wc' },
      { char: '🚿', name: 'shower', keywords: 'shower bathroom wash bath water clean' },
      { char: '🛁', name: 'bathtub', keywords: 'bathtub bath relax clean washroom' },
      { char: '🧹', name: 'broom', keywords: 'broom sweep clean cleaning maid chores' },
      { char: '🧺', name: 'basket', keywords: 'laundry clothes wash basket hamper' },
      { char: '🧼', name: 'soap', keywords: 'soap wash hands bath clean hygiene' },
      { char: '📍', name: 'round_pushpin', keywords: 'location pin map address landmark spot place' },
      { char: '🗺️', name: 'world_map', keywords: 'map navigation geography directions travel' },
      { char: '🚇', name: 'metro', keywords: 'metro subway train transport station transit' },
      { char: '🚉', name: 'station', keywords: 'railway station platform train transit' },
      { char: '🚆', name: 'train2', keywords: 'train commute travel rails locomotive' },
      { char: '🚌', name: 'bus', keywords: 'bus transit commute public transport stop' },
      { char: '🚕', name: 'taxi', keywords: 'taxi cab uber ola transport ride' }
    ]
  },
  {
    id: 'symbols',
    name: 'Hearts & Symbols',
    icon: Heart,
    emojis: [
      { char: '❤️', name: 'heart', keywords: 'heart red love like favorite romance' },
      { char: '🧡', name: 'orange_heart', keywords: 'heart orange love friend' },
      { char: '💛', name: 'yellow_heart', keywords: 'heart yellow friend gold sunny' },
      { char: '💚', name: 'green_heart', keywords: 'heart green nature organic eco' },
      { char: '💙', name: 'blue_heart', keywords: 'heart blue peace trust loyalty' },
      { char: '💜', name: 'purple_heart', keywords: 'heart purple royalty vip luxury' },
      { char: '🖤', name: 'black_heart', keywords: 'heart black dark gothic' },
      { char: '🤍', name: 'white_heart', keywords: 'heart white pure peace clean' },
      { char: '🤎', name: 'brown_heart', keywords: 'heart brown warm chocolate' },
      { char: '💔', name: 'broken_heart', keywords: 'heart broken heartbreak sad upset dump' },
      { char: '❤️‍🔥', name: 'heart_on_fire', keywords: 'heart fire passion desire hot love' },
      { char: '💖', name: 'sparkling_heart', keywords: 'heart sparkle glitter cute special' },
      { char: '💗', name: 'heartpulse', keywords: 'heart pulse growing love blush' },
      { char: '💓', name: 'heartbeat', keywords: 'heart beat thumping love crush' },
      { char: '💞', name: 'revolving_hearts', keywords: 'hearts revolving in love together' },
      { char: '💕', name: 'two_hearts', keywords: 'two hearts love floating sweet' },
      { char: '✨', name: 'sparkles', keywords: 'sparkles shine clean new fresh aesthetic magic' },
      { char: '⭐', name: 'star', keywords: 'star rating favorite yellow review' },
      { char: '🌟', name: 'star2', keywords: 'glowing star bright shiny vip' },
      { char: '💯', name: '100', keywords: '100 hundred perfect score full legit real' },
      { char: '🔥', name: 'fire', keywords: 'fire hot lit trending popular flame' },
      { char: '✅', name: 'white_check_mark', keywords: 'check tick verified confirmed yes done correct' },
      { char: '✔️', name: 'heavy_check_mark', keywords: 'check mark tick verified done approved' },
      { char: '❌', name: 'x', keywords: 'cross x no wrong delete cancel reject' },
      { char: '⚠️', name: 'warning', keywords: 'warning alert caution attention danger notice' },
      { char: '💡', name: 'bulb', keywords: 'idea tip advice light bulb' },
      { char: '📌', name: 'pushpin', keywords: 'pin bookmark note stick notice highlight' },
      { char: '💰', name: 'moneybag', keywords: 'money bag dollar cash rent budget deposit' },
      { char: '💵', name: 'dollar', keywords: 'cash bill dollar money payment pay' },
      { char: '💳', name: 'credit_card', keywords: 'credit card debit pay payment visa master' },
      { char: '🛡️', name: 'shield', keywords: 'shield safe security protected verified trust' },
      { char: '🔔', name: 'bell', keywords: 'bell ring notification alert sound chime' },
      { char: '💬', name: 'speech_balloon', keywords: 'speech bubble chat message talk conversation' },
      { char: '🆒', name: 'cool', keywords: 'cool neat nice' },
      { char: '🆓', name: 'free', keywords: 'free zero brokerage zero cost bonus gift' },
      { char: '🇮🇳', name: 'flag_india', keywords: 'flag india bharat indian tricolor' }
    ]
  }
];

export default function EmojiPicker({
  onSelect,
  onDelete,
  onClose,
  fullWidth = false
}: {
  onSelect: (emoji: string) => void;
  onDelete?: () => void;
  onClose: () => void;
  fullWidth?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'recents' | string>('recents');
  const [search, setSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(DEFAULT_RECENTS);

  // Load recents from localStorage ordered by sent times
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shahya_recent_emojis');
      if (stored) {
        const parsed: { [emoji: string]: number } = JSON.parse(stored);
        const sorted = Object.entries(parsed)
          .sort((a, b) => b[1] - a[1])
          .map(([emoji]) => emoji);

        if (sorted.length > 0) {
          // Merge with defaults to ensure rich set
          const combined = Array.from(new Set([...sorted, ...DEFAULT_RECENTS])).slice(0, 32);
          setRecentEmojis(combined);
        }
      }
    } catch (e) {}
  }, []);

  // Track emoji sent count in localStorage
  const handleEmojiClick = (emoji: string) => {
    try {
      const stored = localStorage.getItem('shahya_recent_emojis');
      const counts: { [char: string]: number } = stored ? JSON.parse(stored) : {};
      counts[emoji] = (counts[emoji] || 0) + 1;
      localStorage.setItem('shahya_recent_emojis', JSON.stringify(counts));

      const updated = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([c]) => c);
      setRecentEmojis(Array.from(new Set([...updated, ...DEFAULT_RECENTS])).slice(0, 32));
    } catch (e) {}

    onSelect(emoji);
  };

  // Fast memoized search across cheatsheet
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return null;

    const matched: EmojiItem[] = [];
    const seen = new Set<string>();

    for (const cat of EMOJI_DATABASE) {
      for (const item of cat.emojis) {
        if (!seen.has(item.char)) {
          if (
            item.name.toLowerCase().includes(query) ||
            item.keywords.toLowerCase().includes(query)
          ) {
            matched.push(item);
            seen.add(item.char);
          }
        }
      }
    }
    return matched;
  }, [search]);

  const activeCategoryData = EMOJI_DATABASE.find((c) => c.id === activeTab);

  return (
    <div
      className={`bg-white border-slate-200/90 shadow-modal flex flex-col z-50 overflow-hidden text-slate-800 select-none ${
        fullWidth ? 'w-full rounded-t-3xl border-t' : 'w-80 sm:w-96 rounded-3xl border animate-modal-pop'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Header with Search, Delete, and Close */}
      <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="search"
            inputMode="text"
            role="searchbox"
            autoComplete="one-time-code"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            placeholder="Search all emojis (e.g. smile, flat, heart)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-7 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Backspace / Delete Button in Header for Quick Erase */}
        {onDelete && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center border border-slate-200/60 shadow-2xs"
            title="Erase / Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors flex-shrink-0"
          title="Close emoji picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Category Tabs (Recent Tab first!) */}
      {!search && (
        <div className="flex items-center justify-around border-b border-slate-100 bg-white px-1 py-1">
          {/* Recent Emojis Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('recents')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-xl transition-all ${
              activeTab === 'recents'
                ? 'text-brand-600 font-bold bg-brand-50/70'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title="Recents (Ordered by sent times)"
          >
            <Clock className={`w-4 h-4 ${activeTab === 'recents' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] font-semibold leading-none truncate">Recents</span>
          </button>

          {/* Category Tabs */}
          {EMOJI_DATABASE.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-brand-600 font-bold bg-brand-50/70'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title={cat.name}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[9px] font-semibold leading-none truncate max-w-[50px]">
                  {cat.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Main Emoji Grid */}
      <div className="h-56 overflow-y-auto p-2.5 bg-white space-y-2 no-scrollbar">
        {searchResults ? (
          <div>
            <div className="text-[11px] font-bold text-slate-400 px-1 mb-1.5">
              {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for "{search}"
            </div>
            {searchResults.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold">No matching emoji found</p>
                <p className="text-[11px]">Try typing "smile", "love", "home", or "food"</p>
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-1">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEmojiClick(item.char);
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-slate-100 active:scale-90 transition-transform flex items-center justify-center text-2xl select-none"
                    title={`:${item.name}:`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'recents' ? (
          <div>
            <div className="text-[11px] font-bold text-slate-400 px-1 mb-1.5 flex items-center justify-between">
              <span>Frequently Used (Most Sent First)</span>
              <span className="text-[10px] text-slate-300 font-normal">Auto-saved</span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {recentEmojis.map((char, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEmojiClick(char);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-slate-100 active:scale-90 transition-transform flex items-center justify-center text-2xl select-none"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {activeCategoryData?.emojis.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEmojiClick(item.char);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-slate-100 active:scale-90 transition-transform flex items-center justify-center text-2xl select-none"
                title={`:${item.name}:`}
              >
                {item.char}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. WhatsApp-Style Frequent Reactions & Erase Row */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-1">
        <div className="flex-1 flex items-center justify-around text-lg">
          {recentEmojis.slice(0, 7).map((char, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleEmojiClick(char);
              }}
              className="hover:scale-125 transition-transform active:scale-90 p-1"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Erase / Backspace Button */}
        {onDelete && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="p-1.5 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1 text-xs font-bold shadow-2xs flex-shrink-0"
            title="Erase / Backspace"
          >
            <Delete className="w-4 h-4 text-slate-500" />
            <span className="hidden xs:inline text-[11px]">Erase</span>
          </button>
        )}
      </div>
    </div>
  );
}
