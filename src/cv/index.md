---
layout: cv.njk
permalink: /cv/
title: Curriculum Vitae
description: Curriculum vitae of Your Name, photographer based in Your City.
# By default this page is public. To ask search engines not to index it,
# remove the "#" from the next line. It is also left out of sitemap.xml
# because it does not use the base or gallery layout.
# noindex: true
---
<div class="cv">
<div class="cv-head">
{%- if site.logo %}
<a href="/" class="cv-logo"><img src="{{ site.logo }}" alt="{{ site.name }}, home" width="96" height="96" /></a>
{%- endif %}
<div class="cv-head-text">
<h1>{{ site.name }}</h1>
<p class="cv-role"><span class="cv-role-title">Photographer</span>, based in Your City</p>
<p class="cv-contact"><span class="cv-contact-label">Contact</span> <a href="mailto:you@example.com">you@example.com</a> / <a href="tel:+000000000000">+00 000 000 000</a></p>
{%- if site.cvPdf %}
<p class="cv-download"><a href="/curriculum.pdf">Download PDF</a></p>
{%- endif %}
</div>
<div class="cv-photo">
{% image "src/images/cv/cv-photo.jpg", "Placeholder portrait: replace it with your own photo", "(max-width: 600px) 96px, 180px" %}
</div>
</div>

{% cvsection "Education" %}
2016–2019 | Bachelor of Arts in Photography, Example University (City, Country). A longer entry can
            continue on the next line: a line that starts with spaces belongs to the entry above.
2014–2016 | Course in Documentary Photography, Example School of Art (City).
{% endcvsection %}

{% cvsection "Relevant experience" %}
2022–now | Freelance photographer: portraits, editorial work and events for clients such as Example
           Magazine and Example Theatre.
2019–22 | Assistant to a studio photographer, Example Studio (City).
2018 | Group exhibition "Example Title", Example Gallery (City).
{% endcvsection %}

{% cvsection "Language skills" %}
English | Native language.
Spanish, French | Fluent in both languages.
{% endcvsection %}

{% cvsection "Other relevant" %}
A section without labels is drawn as a list of paragraphs. Use it for anything that does not fit a
  date or a heading, with [links](https://example.com) when you need them.
Portfolio: [example.com](/) or Instagram [@your.handle](https://www.instagram.com/)
{% endcvsection %}

</div>
