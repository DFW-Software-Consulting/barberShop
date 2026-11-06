# The Barber Spot

A demo website for a fictional Dallas-Fort Worth barbershop, built by [DFW Software Consulting](https://dfwsc.com) to show prospective barbershop clients what we can deliver.

It is adapted from the free "Barber" template by codewithsadee and rebuilt as a plain HTML, CSS and JavaScript page (no framework, no build step). All business details, prices, names and reviews are fictional placeholders, and the forms are demos that send nothing.

Live demo: https://dfw-software-consulting.github.io/barberShop/

## View locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000/. All asset paths are relative, so the site also works under the GitHub Pages `/barberShop/` path.

## Structure

- `index.html` - single page: hero, services, pricing, barbers, gallery, reviews, booking form, contact
- `assets/css/style.css` - design tokens and styles; `flaticon.min.css` is the icon font
- `assets/js/script.js` - nav, pricing filter, form validation, open-now status
- `assets/images/` - photos used by the page
