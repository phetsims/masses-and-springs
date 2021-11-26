// Copyright 2017-2021, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { VBox } from '../../../../scenery/js/imports.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import OneSpringScreenView from '../../common/view/OneSpringScreenView.js';
import massesAndSprings from '../../massesAndSprings.js';

class EnergyScreenView extends OneSpringScreenView {

  /**
   * @param {EnergyModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem, {
      dampingVisible: true
    } );
    // Contains visibility options for the reference lines and displacement arrow
    const indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

    // VBox that contains all of the panel's content
    const optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    const rightPanelsVBox = new VBox( { children: [ optionsPanel, this.toolboxPanel ], spacing: this.spacing * 0.9 } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();


    this.visibleBoundsProperty.link( () => {
      rightPanelsVBox.rightTop = new Vector2( this.panelRightSpacing, this.energyGraphAccordionBox.top );
    } );

    this.shelf.rectWidth = 140;
    this.shelf.left = this.energyGraphAccordionBox.right + this.spacing;

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();
  }
}

massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );
export default EnergyScreenView;