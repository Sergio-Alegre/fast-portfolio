---
layout: cv.njk
permalink: /cv/
title: Curriculum Vitae
description: Curriculum vitae of Don Juan, a very generic example.
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
<h1>Don Juan</h1>
<p class="cv-role"><span class="cv-role-title">Artist</span>, based in Anytown</p>
<p class="cv-contact"><span class="cv-contact-label">Address</span> 123 Fake Street, Anytown</p>
<p class="cv-contact"><span class="cv-contact-label">Contact</span> <a href="mailto:your@email.com">your@email.com</a> / <a href="tel:+123456789">+123 456 789</a></p>
{%- if site.cvPdf %}
<p class="cv-download"><a href="/curriculum.pdf">Download PDF</a></p>
{%- endif %}
</div>
<div class="cv-photo">
{% image "src/images/cv/cv-photo.jpg", "A badly drawn portrait of Beethoven, in the style of MS Paint. Replace it with your own photo", "(max-width: 600px) 96px, 180px" %}
</div>
</div>

{% cvsection "Education" %}
2005–2009 | Generic bachelor degree in an unknown city.
2010–2012 | Generic master studies in a different country.
{% endcvsection %}

{% cvsection "Relevant experience" %}
2013–2019 | I have done a lot.
2019–2024 | I have done a lot too.
2025 | A failed project that still looks cool on my curriculum.
{% endcvsection %}

{% cvsection "Language skills" %}
Esperanto | C1.
Latin | Roman Empire edition.
Sanskrit | Yes.
{% endcvsection %}

</div>
