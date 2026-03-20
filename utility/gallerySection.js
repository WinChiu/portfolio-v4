(function () {
  const section = document.querySelector('.section--gallery');

  if (!section || !window.d3) return;

  const graphRoot = section.querySelector('[data-gallery-graph]');
  const graphDataElement = section.querySelector('[data-gallery-graph-data]');
  const stage = section.querySelector('[data-gallery-stage]');
  const intro = section.querySelector('.gallery__intro');
  const container = section.querySelector('.container');
  const card = section.querySelector('[data-gallery-card]');
  const cardImage = section.querySelector('[data-gallery-card-image]');
  const cardCaption = section.querySelector('[data-gallery-card-caption]');
  const cardLocation = section.querySelector('[data-gallery-card-location]');
  const cardTags = section.querySelector('[data-gallery-card-tags]');
  const lightbox = section.querySelector('[data-gallery-lightbox]');
  const lightboxCard = section.querySelector('[data-gallery-lightbox-card]');
  const lightboxImage = section.querySelector('[data-gallery-lightbox-image]');
  const lightboxCaption = section.querySelector('[data-gallery-lightbox-caption]');
  const lightboxLocation = section.querySelector('[data-gallery-lightbox-location]');
  const lightboxTags = section.querySelector('[data-gallery-lightbox-tags]');
  const lightboxClosers = Array.from(
    section.querySelectorAll('[data-gallery-lightbox-close]'),
  );

  if (
    !graphRoot ||
    !graphDataElement ||
    !stage ||
    !card ||
    !intro ||
    !container ||
    !lightbox ||
    !lightboxCard ||
    !lightboxImage
  )
    return;

  const graphData = JSON.parse(graphDataElement.textContent || '{}');
  const items = graphData.items || [];
  const nodes = (graphData.nodes || []).map((node) => ({ ...node }));
  const links = (graphData.links || []).map((link) => ({ ...link }));

  if (!items.length || !nodes.length) return;

  function getGraphSize() {
    const rect = graphRoot.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    return {
      width: Math.max(
        1,
        Math.round(rect.width || stageRect.width || graphRoot.clientWidth || 0),
      ),
      height: Math.max(
        1,
        Math.round(rect.height || stageRect.height || graphRoot.clientHeight || 0),
      ),
    };
  }

  let { width, height } = getGraphSize();
  const itemMap = new Map(items.map((item) => [item.id, item]));
  let draggingNodeId = null;
  let mobilePinnedImageId = null;
  let dragStartPoint = null;
  const typeCounters = {
    image: 0,
    location: 0,
    tag: 0,
  };

  function isMobileGraph() {
    return window.matchMedia('(max-width: 30rem)').matches;
  }

  function isDesktopGraph() {
    return !isMobileGraph();
  }

  function updateStageHeight() {
    const mobileMediaQuery = window.matchMedia('(max-width: 30rem)');

    if (!mobileMediaQuery.matches) {
      stage.style.height = '';
      return;
    }

    const containerStyles = window.getComputedStyle(container);
    const paddingTop = Number.parseFloat(containerStyles.paddingTop || '0');
    const paddingBottom = Number.parseFloat(containerStyles.paddingBottom || '0');
    const containerRect = container.getBoundingClientRect();
    const introRect = intro.getBoundingClientRect();
    const availableHeight =
      containerRect.height - introRect.height - paddingTop - paddingBottom;

    stage.style.height = `${Math.max(240, availableHeight)}px`;
  }

  function getInitialPosition(node, index) {
    const mobile = isMobileGraph();

    if (node.type === 'location') {
      const columns = mobile ? 2 : 3;
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        x: width * (mobile ? 0.32 + column * 0.28 : 0.18 + column * 0.31),
        y: height * (mobile ? 0.7 + row * 0.1 : 0.58 + row * 0.16),
      };
    }

    if (node.type === 'tag') {
      const columns = mobile ? 3 : 4;
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        x: width * (mobile ? 0.14 + column * 0.24 : 0.12 + column * 0.22),
        y: height * (mobile ? 0.34 + row * 0.12 : 0.2 + row * 0.2),
      };
    }

    const columns = mobile ? 3 : 4;
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: width * (mobile ? 0.24 + column * 0.18 : 0.24 + column * 0.18),
      y: height * (mobile ? 0.5 + row * 0.12 : 0.34 + row * 0.18),
    };
  }

  function getForceTargets() {
    if (isMobileGraph()) {
      return {
        centerY: height * 0.64,
        x(node) {
          if (node.type === 'location') return width * 0.5;
          if (node.type === 'tag') return width * 0.5;
          return width * 0.5;
        },
        y(node) {
          if (node.type === 'location') return height * 0.72;
          if (node.type === 'tag') return height * 0.42;
          return height * 0.58;
        },
      };
    }

    return {
      centerY: height / 2,
      x(node) {
        if (node.type === 'location') return width * 0.42;
        if (node.type === 'tag') return width * 0.5;
        return width * 0.48;
      },
      y(node) {
        if (node.type === 'location') return height * 0.68;
        if (node.type === 'tag') return height * 0.32;
        return height * 0.5;
      },
    };
  }

  nodes.forEach((node) => {
    const type = node.type || 'image';
    const index = typeCounters[type] || 0;

    const position = getInitialPosition(node, index);
    node.x = position.x;
    node.y = position.y;

    typeCounters[type] = index + 1;
  });

  const initialTargets = getForceTargets();

  const svg = d3
    .select(graphRoot)
    .append('svg')
    .attr('class', 'gallery__svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  const linkLayer = svg.append('g').attr('class', 'gallery__linkLayer');
  const nodeLayer = svg.append('g').attr('class', 'gallery__nodeLayer');
  const labelLayer = svg.append('g').attr('class', 'gallery__labelLayer');

  const linkSelection = linkLayer
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'gallery__line');

  const nodeSelection = nodeLayer
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('class', (node) => `gallery__node gallery__node--${node.type}`)
    .attr('r', (node) => {
      if (node.type === 'location') return 16;
      if (node.type === 'tag') return 14;
      return 9;
    })
    .on('mouseenter', function (event, node) {
      handleNodeEnter(event, node, 'hover');
    })
    .on('mousemove', function (event, node) {
      handleNodeMove(event, node);
    })
    .on('mouseleave', function (_, node) {
      handleNodeLeave(node);
    })
    .on('click', function (event, node) {
      handleNodeEnter(event, node, 'click');
    });

  const labelSelection = labelLayer
    .selectAll('text')
    .data(nodes.filter((node) => node.type !== 'image'))
    .join('text')
    .attr('class', (node) => `gallery__label gallery__label--${node.type}`)
    .attr('text-anchor', 'middle')
    .attr('dy', 38)
    .text((node) => node.label || '');

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id((node) => node.id)
        .distance((link) => {
          const targetType =
            typeof link.target === 'object' ? link.target.type : 'tag';
          return targetType === 'location' ? 180 : 140;
        })
        .strength(0.75),
    )
    .force('charge', d3.forceManyBody().strength((node) => {
      if (node.type === 'image') return -260;
      if (node.type === 'location') return -400;
      return -320;
    }))
    .force('collision', d3.forceCollide().radius((node) => {
      if (node.type === 'location') return 78;
      if (node.type === 'tag') return 62;
      return 28;
    }))
    .force('center', d3.forceCenter(width / 2, initialTargets.centerY).strength(0.01))
    .force('x', d3.forceX((node) => initialTargets.x(node)).strength(0.0015))
    .force('y', d3.forceY((node) => initialTargets.y(node)).strength(0.004))
    .alpha(1)
    .alphaDecay(0.04)
    .on('tick', ticked);

  function updateGraphBounds() {
    updateStageHeight();

    const nextSize = getGraphSize();
    width = nextSize.width;
    height = nextSize.height;
    const targets = getForceTargets();

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    simulation.force('center', d3.forceCenter(width / 2, targets.centerY).strength(0.01));
    simulation.force('x', d3.forceX((node) => targets.x(node)).strength(0.0015));
    simulation.force('y', d3.forceY((node) => targets.y(node)).strength(0.004));
    simulation.alpha(0.2).restart();
  }

  nodeSelection.call(
    d3
      .drag()
      .on('start', (event, node) => {
        if (!event.active) simulation.alphaTarget(0.2).restart();
        draggingNodeId = node.id;
        dragStartPoint = {
          x: event.x,
          y: event.y,
        };
        updateHighlightForNode(node);

        if (isDesktopGraph() && node.type === 'image' && event.sourceEvent) {
          const { clientX, clientY } = event.sourceEvent;
          if (typeof clientX === 'number' && typeof clientY === 'number') {
            openDesktopCard(node.id, clientX, clientY);
          }
        } else if (isDesktopGraph()) {
          closePreview();
        }
      })
      .on('drag', (event, node) => {
        node.fx = Math.max(8, Math.min(width - 8, event.x));
        node.fy = Math.max(8, Math.min(height - 8, event.y));

        if (isDesktopGraph() && node.type === 'image' && event.sourceEvent) {
          const { clientX, clientY } = event.sourceEvent;
          if (typeof clientX === 'number' && typeof clientY === 'number') {
            openDesktopCard(node.id, clientX, clientY);
          }
        }
      })
      .on('end', (event, node) => {
        if (!event.active) simulation.alphaTarget(0);
        draggingNodeId = null;
        if (node.type === 'image') {
          node.fx = null;
          node.fy = null;

          if (isMobileGraph()) {
            const movedX = (dragStartPoint?.x ?? event.x) - event.x;
            const movedY = (dragStartPoint?.y ?? event.y) - event.y;
            const dragDistance = Math.hypot(movedX, movedY);

            if (dragDistance < 10) {
              openMobileLightbox(node.id);
            }

            dragStartPoint = null;
            return;
          }

          if (isDesktopGraph() && event.sourceEvent) {
            const { clientX, clientY } = event.sourceEvent;
            if (typeof clientX === 'number' && typeof clientY === 'number') {
              openDesktopCard(node.id, clientX, clientY);
            }
          }
        }

        dragStartPoint = null;
      }),
  );

  function clampNode(node) {
    const padding = node.type === 'location' ? 12 : node.type === 'tag' ? 10 : 8;
    node.x = Math.max(padding, Math.min(width - padding, node.x));
    node.y = Math.max(padding, Math.min(height - padding, node.y));
  }

  function ticked() {
    nodes.forEach(clampNode);

    linkSelection
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y);

    nodeSelection
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y);

    labelSelection
      .attr('x', (node) => node.x)
      .attr('y', (node) => node.y);
  }

  function syncAspectState(wrapper, imageElement) {
    if (!wrapper || !imageElement) return;

    const isPortrait = imageElement.naturalHeight > imageElement.naturalWidth;
    wrapper.classList.toggle('gallery__card--portrait', isPortrait);
    wrapper.classList.toggle('gallery__card--landscape', !isPortrait);
  }

  function updateMedia(wrapper, imageElement, item) {
    if (!wrapper || !imageElement || !item) return;

    imageElement.onload = () => {
      syncAspectState(wrapper, imageElement);
    };
    imageElement.src = item.imageSrc;
    imageElement.alt = item.imageAlt;

    if (imageElement.complete) {
      syncAspectState(wrapper, imageElement);
    }
  }

  function setTextContent(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function updateCard(imageId) {
    const item = itemMap.get(imageId);
    if (!item) return;

    updateMedia(card, cardImage, item);
    updateMedia(lightboxCard, lightboxImage, item);

    const tagsText = (item.tags || []).join(' / ');
    setTextContent(cardCaption, item.note || '');
    setTextContent(lightboxCaption, item.note || '');
    setTextContent(cardLocation, item.locationDisplay || '');
    setTextContent(lightboxLocation, item.locationDisplay || '');
    setTextContent(cardTags, tagsText);
    setTextContent(lightboxTags, tagsText);
  }

  function resolveImageId(node) {
    if (node.type === 'image') return node.id;

    const match = links.find((link) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return targetId === node.id && itemMap.has(sourceId);
    });

    return match
      ? typeof match.source === 'object'
        ? match.source.id
        : match.source
      : items[0].id;
  }

  function clearHighlight() {
    nodeSelection
      .classed('is-active', false)
      .classed('is-dimmed', false);

    labelSelection
      .classed('is-active', false)
      .classed('is-dimmed', false);

    linkSelection
      .classed('is-active', false)
      .classed('is-dimmed', false);
  }

  function updateHighlightForNode(activeNode) {
    if (!activeNode) {
      clearHighlight();
      return;
    }

    const activeNodeId = activeNode.id;
    const relatedNodeIds = new Set([activeNodeId]);
    const relatedLinkKeys = new Set();

    links.forEach((link) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;

      if (sourceId === activeNodeId || targetId === activeNodeId) {
        relatedNodeIds.add(sourceId);
        relatedNodeIds.add(targetId);
        relatedLinkKeys.add(`${sourceId}__${targetId}`);
      }
    });

    nodeSelection
      .classed('is-active', (node) => relatedNodeIds.has(node.id))
      .classed('is-dimmed', (node) => !relatedNodeIds.has(node.id));

    labelSelection
      .classed('is-active', (node) => relatedNodeIds.has(node.id))
      .classed('is-dimmed', (node) => !relatedNodeIds.has(node.id));

    linkSelection
      .classed('is-active', (link) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return relatedLinkKeys.has(`${sourceId}__${targetId}`);
      })
      .classed('is-dimmed', (link) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return !relatedLinkKeys.has(`${sourceId}__${targetId}`);
      });
  }

  function placeCard(clientX, clientY) {
    const stageRect = stage.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset = 18;
    let left = clientX - stageRect.left + offset;
    let top = clientY - stageRect.top + offset;

    if (left + cardRect.width > stageRect.width - 12) {
      left = clientX - stageRect.left - cardRect.width - offset;
    }

    if (top + cardRect.height > stageRect.height - 12) {
      top = stageRect.height - cardRect.height - 12;
    }

    left = Math.max(12, left);
    top = Math.max(12, top);

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function openDesktopCard(imageId, clientX, clientY) {
    updateCard(imageId);
    mobilePinnedImageId = null;
    lightbox.hidden = true;
    section.classList.remove('section--gallery-lightbox-open');
    card.hidden = false;
    placeCard(clientX, clientY);
  }

  function openMobileLightbox(imageId) {
    updateCard(imageId);
    mobilePinnedImageId = imageId;
    card.hidden = true;
    lightbox.hidden = false;
    section.classList.add('section--gallery-lightbox-open');
  }

  function closePreview() {
    mobilePinnedImageId = null;
    card.hidden = true;
    lightbox.hidden = true;
    section.classList.remove('section--gallery-lightbox-open');
  }

  function handleNodeEnter(event, node, trigger) {
    if (isMobileGraph() && trigger !== 'click') {
      return;
    }

    updateHighlightForNode(node);

    if (node.type === 'image') {
      const imageId = resolveImageId(node);
      if (isMobileGraph()) {
        openMobileLightbox(imageId);
      } else if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
        openDesktopCard(imageId, event.clientX, event.clientY);
      }
      return;
    }

    closePreview();
  }

  function handleNodeMove(event, node) {
    if (node.type !== 'image' || !isDesktopGraph()) return;
    const imageId = resolveImageId(node);
    openDesktopCard(imageId, event.clientX, event.clientY);
  }

  function handleNodeLeave(node) {
    if (isMobileGraph()) return;

    if (draggingNodeId && node && draggingNodeId === node.id) {
      return;
    }

    simulation.alphaTarget(0);
    clearHighlight();
    closePreview();
  }

  graphRoot.addEventListener('mouseleave', () => {
    if (isMobileGraph() && mobilePinnedImageId) return;
    if (isMobileGraph()) return;
    simulation.alphaTarget(0);
    clearHighlight();
    closePreview();
  });

  lightboxClosers.forEach((closer) => {
    closer.addEventListener('click', () => {
      clearHighlight();
      closePreview();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobilePinnedImageId) {
      clearHighlight();
      closePreview();
    }
  });

  graphRoot.addEventListener('click', (event) => {
    if (!isMobileGraph()) return;
    if (event.target.closest('.gallery__node--image')) return;

    clearHighlight();
    closePreview();
  });

  window.addEventListener('resize', updateGraphBounds);
  if (window.ResizeObserver) {
    const graphResizeObserver = new ResizeObserver(() => {
      updateGraphBounds();
    });
    graphResizeObserver.observe(graphRoot);
    graphResizeObserver.observe(stage);
  }

  requestAnimationFrame(() => {
    updateGraphBounds();
  });

  closePreview();
  clearHighlight();
})();
