import p_img1 from './p_img1.png'
import p_img2_1 from './p_img2_1.png'
import p_img2_2 from './p_img2_2.png'
import p_img2_3 from './p_img2_3.png'
import p_img2_4 from './p_img2_4.png'
import p_img3 from './p_img3.png'
import p_img4 from './p_img4.png'
import p_img5 from './p_img5.png'
import p_img6 from './p_img6.png'
import p_img7 from './p_img7.png'
import p_img8 from './p_img8.png'
import p_img9 from './p_img9.png'
import p_img10 from './p_img10.png'
import p_img11 from './p_img11.png'
import p_img12 from './p_img12.png'
import p_img13 from './p_img13.png'
import p_img14 from './p_img14.png'
import p_img15 from './p_img15.png'
import p_img16 from './p_img16.png'
import p_img17 from './p_img17.png'
import p_img18 from './p_img18.png'
import p_img19 from './p_img19.png'
import p_img20 from './p_img20.png'
import p_img21 from './p_img21.png'
import p_img22 from './p_img22.png'
import p_img23 from './p_img23.png'
import p_img24 from './p_img24.png'
import p_img25 from './p_img25.png'
import p_img26 from './p_img26.png'
import p_img27 from './p_img27.png'
import cod from './cod.png'
import Bottomwear from './Bottomwear.png'
import winter from './winter.png'
import BagPack from './BagPack.jpg'
import SmartWatch from './SmartWatch.jpg'
import topwear from './topwear.png'
import p_img34 from './p_img34.png'
import p_img35 from './p_img35.png'
import kids from './kids.png'
import men from './man.png'
import women from './women.jpg'
import homeD from './home-delivery.webp'
import Boat from './BoatD.jpg'
import p_img41 from './p_img41.png'
import p_img42 from './p_img42.png'
import p_img43 from './p_img43.png'
import p_img44 from './p_img44.png'
import Random from './random.png'
import Alks from './elis.png'
import apple from './apple.png'
import Volcom from './volcom.png'
import QuickSilver from './QuickSilver.png'
import HarleyX from './ddf.png'
import Billabong from './Billabong-logo.png'
import Gucci from './gucci.png'


import logo from './logo.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'
import hero from './hero.jpg' 
export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon,
    hero,
    cod
    
}
export const categories = [
  {
    id:"aaa",
    cat_name: "Men" ,
    cat_image: [men],
    show_home: true
  },
  {
    id:"aab",
    cat_name: "Women" ,
    cat_image: [women],
    show_home: true
    
  },
  {
    id:"aac",
    cat_name: "Kids" ,
    cat_image: [kids],
    show_home: true
    
  },
  
  
  
];

export const hero_section =[
  {
    image:[hero_img],
    bg_video_Link:"https://youtu.be/Lyj1u-JRonY",
    Text1:"Top Picks of the Season",
    Text2:"Explore Our Latest Collection",
    Text3:"Experience timeless designs crafted for comfort, quality, and modern living.",
    btn_Name:"Explore",
    btn_Link:"",
  }
];

export const delivery_methods = [
  {
    image: [homeD],
    method_name: "Home Delivery",
    service_areas: "Male / Hulhumale",
    description: "Experience timeless deliveries with our superb home delivery service.",
    Delivery_charge : 0,
    
    Limit_Unit_minimum: "mvr",
    minimum_order_amount: 200,
    Limit_Unit_maximum:"kg",
    maximum_order_limit: 1000,

    apply_extra_charge_minimum: false,
    extra_charge_amount_minimum: 20,

    apply_extra_charge_maximum: true,
    extra_charge_amount_maximum: 50,

    display: true
  },
  {
    image: [Boat],
    method_name: "Boat Delivery",
    service_areas: "Boat in Male / Hulhumale",
    description: "Experience timeless deliveries with our superb home delivery service.",
    Delivery_charge : 0,
    
    Limit_Unit_minimum: "mvr",
    minimum_order_amount: 200,
    Limit_Unit_maximum: "kg",
    maximum_order_limit: 1000,

    apply_extra_charge_minimum: false,
    extra_charge_amount_minimum: 20,

    apply_extra_charge_maximum: true,
    extra_charge_amount_maximum: 50,

    display: true
  }
];

export const Subcategories = [
  {
    id:"aaa",
    cat_name: "Topwear" ,
    cat_image: [topwear],
    show_home: true
  },
  {
    id:"aab",
    cat_name: "Bottomwear" ,
    cat_image: [Bottomwear],
    show_home: true
    
  },
  
  {
    id:"aac",
    cat_name: "Winterwear" ,
    cat_image: [winter],
    show_home: false
    
  },
   {
    id:"aad",
    cat_name: "Smart Watch" ,
    cat_image: [SmartWatch],
    show_home: false
    
  },
  {
    id:"aae",
    cat_name: "Bag Pack" ,
    cat_image: [BagPack],
    show_home: true
    
  },
];

export const Brands = [
  {
    id:"aaa",
    Brand_name: "Apple" ,
    Brand_image: [apple],
    show_home: true
  },
  {
    id:"aab",
    Brand_name: "Volcom" ,
    Brand_image: [Volcom],
    show_home: true
  },
  {
    id:"aac",
    Brand_name: "Quick Silver" ,
    Brand_image: [QuickSilver],
    show_home: true
  },
  {
    id:"aad",
    Brand_name: "Harley X" ,
    Brand_image: [HarleyX],
    show_home: true
  },
  {
    id:"Ripp Curl",
    Brand_name: "billabong" ,
    Brand_image: [Billabong],
    show_home: true
  },
  {
    id:"aae",
    Brand_name: "Gucci" ,
    Brand_image: [Gucci],
    show_home: true
  },
  {
    id:"aaf",
    Brand_name: "alks" ,
    Brand_image: [Alks],
    show_home: true
  },
   {
    id:"aag",
    Brand_name: "random" ,
    Brand_image: [Random],
    show_home: false
  },
  
];

export const products = [
   {
    _id: "p1",
    name: "Large Capacity Travel Backpack",
    description: "Durable backpack with multiple pockets.",
    long_description: "A spacious and sturdy men’s travel bag pack with comfortable straps and multiple compartments.",
    price: 120,
    brand: "aae",
    image: [p_img1],
    category: "Men",
    subCategory: "Bag Pack",
    sizes: [],
    qty: 1,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    video: "",
    videoFr: ""
  },
  {
    _id: "p2",
    name: "Smart Digital Watch",
    description: "Advanced smartwatch for men.",
    long_description: "Stylish smartwatch with multiple features including health tracking, notifications, and water resistance.",
    price: 199,
    brand: "aaa",
    image: [p_img2_1, p_img2_2, p_img2_3, p_img2_4],
    category: "Men",
    subCategory: "Smart Watch",
    sizes: [],
    qty: 0,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: true,
    video: "",
    videoFr: ""
  },
  {
    _id: "p3",
    name: "Casual Cotton Shirt",
    description: "Soft cotton shirt for daily wear.",
    long_description: "Made from breathable cotton, perfect for summer casual wear.",
    price: 45,
    brand: "aad",
    image: [p_img3],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    qty: 50,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: false,
    video: "",
    videoFr: ""
  },
  {
    _id: "p4",
    name: "Slim Fit Jeans",
    description: "Trendy denim jeans.",
    long_description: "Durable denim jeans with a slim fit design for everyday style.",
    price: 70,
    brand: "aag",
    image: [p_img4],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    qty: 32,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p5",
    name: "Winter Jacket",
    description: "Warm insulated jacket.",
    long_description: "Perfect for cold weather, offering comfort and style with water-resistant material.",
    price: 150,
    brand: "Ripp Curl",
    image: [p_img5],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["M", "L", "XL"],
    qty: 18,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p6",
    name: "Women Summer Dress",
    description: "Lightweight floral dress.",
    long_description: "Casual and comfortable summer dress for women, designed with breathable fabric.",
    price: 85,
    brand: "aac",
    image: [p_img6],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    qty: 25,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
   {
    _id: "p7",
    name: "Kids Hoodie",
    description: "Soft hoodie for kids.",
    long_description: "Comfortable hoodie made from soft cotton blend, ideal for kids’ casual wear.",
    price: 55,
    brand: "aad",
    image: [p_img7],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M"],
    qty: 40,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p8",
    name: "Men Polo T-Shirt",
    description: "Classic polo shirt.",
    long_description: "Versatile polo t-shirt made with premium cotton for both casual and semi-formal looks.",
    price: 50,
    brand: "aaa",
    image: [p_img8],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    qty: 45,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p9",
    name: "Women Skinny Jeans",
    description: "Slim fit women’s jeans.",
    long_description: "Trendy denim jeans designed for women, providing both style and comfort.",
    price: 65,
    brand: "aac",
    image: [p_img9],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    qty: 38,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p10",
    name: "Kids Winter Jacket",
    description: "Warm kids jacket.",
    long_description: "Insulated jacket for kids, designed for warmth and comfort during winter.",
    price: 90,
    brand: "aag",
    image: [p_img10],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M"],
    qty: 15,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p11",
    name: "Men Formal Shirt",
    description: "Slim-fit cotton formal shirt.",
    long_description: "Designed for office and formal occasions with breathable cotton fabric.",
    price: 60,
    brand: "aad",
    image: [p_img11],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    qty: 28,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p12",
    name: "Women Cardigan",
    description: "Lightweight knitted cardigan.",
    long_description: "Soft and cozy cardigan for layering in cool weather.",
    price: 75,
    brand: "aaa",
    image: [p_img12],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    qty: 20,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p13",
    name: "Kids Joggers",
    description: "Comfortable cotton jogger pants.",
    long_description: "Designed for active kids, made from durable cotton blend.",
    price: 40,
    brand: "aab",
    image: [p_img13],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M"],
    qty: 30,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p14",
    name: "Men Hoodie",
    description: "Casual men’s hoodie.",
    long_description: "Made from soft fleece material, ideal for winter casual wear.",
    price: 85,
    brand: "aac",
    image: [p_img14],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["M", "L", "XL"],
    qty: 22,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p15",
    name: "Women Blouse",
    description: "Chic women’s blouse.",
    long_description: "Stylish blouse designed with premium lightweight fabric.",
    price: 55,
    brand: "aad",
    image: [p_img15],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    qty: 26,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p16",
    name: "Kids Denim Shorts",
    description: "Casual denim shorts for kids.",
    long_description: "Durable and stylish shorts for everyday play and casual wear.",
    price: 35,
    brand: "aag",
    image: [p_img16],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M"],
    qty: 44,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p17",
    name: "Men Polo T-shirt",
    description: "Classic men’s polo shirt.",
    long_description: "Premium cotton polo t-shirt suitable for casual and semi-formal use.",
    price: 50,
    brand: "aaa",
    image: [p_img17],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    qty: 38,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p18",
    name: "Women Jeans",
    description: "Trendy skinny jeans.",
    long_description: "Designed for women, offering a flattering fit and stretch fabric.",
    price: 68,
    brand: "aac",
    image: [p_img18],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    qty: 29,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p19",
    name: "Kids Sweater",
    description: "Warm winter sweater.",
    long_description: "Soft wool sweater for kids, ensuring comfort and warmth.",
    price: 48,
    brand: "aad",
    image: [p_img19],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M"],
    qty: 36,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p20",
    name: "Men Tracksuit Pants",
    description: "Comfortable jogger pants.",
    long_description: "Made for workouts and casual wear with stretchable fabric.",
    price: 65,
    brand: "aac",
    image: [p_img20],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    qty: 41,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p21",
    name: "Women Crop Top",
    description: "Trendy women’s crop top.",
    long_description: "Stylish and lightweight crop top made with soft cotton blend.",
    price: 42,
    brand: "aaa",
    image: [p_img21],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    qty: 34,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p22",
    name: "Kids Track Pants",
    description: "Durable track pants for kids.",
    long_description: "Stretchable and comfortable pants suitable for sports and casual wear.",
    price: 38,
    brand: "aag",
    image: [p_img22],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M"],
    qty: 27,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p23",
    name: "Men Sweatshirt",
    description: "Casual fleece sweatshirt.",
    long_description: "Perfect winterwear for men with soft fleece lining.",
    price: 78,
    brand: "aad",
    image: [p_img23],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["M", "L", "XL"],
    qty: 23,
    miniQty: 1,
    date: Date.now(),
    bestseller: false,
    featured: true,
    status: "Available",
    video: "",
    videoFr: ""
  },
  {
    _id: "p24",
    name: "Women Leggings",
    description: "Comfort fit leggings.",
    long_description: "Stretchable leggings perfect for workouts and casual use.",
    price: 35,
    brand: "aac",
    image: [p_img24],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    qty: 52,
    miniQty: 1,
    date: Date.now(),
    bestseller: true,
    featured: false,
    status: "Available",
    video: "",
    videoFr: ""
  }

     
    // Repeat similar adjustments for the rest of the dataset.
];
